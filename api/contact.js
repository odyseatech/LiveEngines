'use strict';

/* Formulario de #contacto → SMTP de Zoho desde Vercel.
 *
 * Arquitectura: visitante → formulario (liveengines.com/#contacto) → fetch a
 * /api/contact → función serverless de Vercel (Node.js) → SMTP de Zoho Mail
 * → hola@liveengines.com, y el lead se persiste en la tabla `leads` de
 * Odysea Leads (proyecto zwkeyfnbcwbveygyrwmq) para gestionarlo en
 * panel.odysea.tech/panel, separado por la columna `brand`.
 *
 * Vercel ejecuta las functions en Node.js y permite salida SMTP por TLS
 * (puerto 465), así que este script envía directamente desde la cuenta de
 * Zoho del dominio, sin dependencias de terceros (solo el módulo `tls`).
 *
 * Credenciales SOLO por variables de entorno de Vercel (nunca en el repo,
 * el frontend ni los logs):
 *   SMTP_HOST    → servidor SMTP (default smtp.zoho.com)
 *   SMTP_PORT    → puerto (default 465)
 *   SMTP_USER    → buzón de Zoho autenticado (default hola@liveengines.com)
 *   SMTP_PASS    → contraseña o App Password (OBLIGATORIA)
 *   CONTACT_TO   → buzón que recibe los leads (default hola@liveengines.com)
 *   MAIL_FROM    → remitente (default SMTP_USER; debe pertenecer al dominio
 *                  autenticado en Zoho)
 *   SITE_URL     → URL pública del sitio (default https://liveengines.com)
 *   LOGO_URL     → logo para el correo (default {SITE_URL}/images/le-email.png)
 *   PANEL_URL    → enlace del correo interno (default https://panel.odysea.tech/panel)
 *   SLACK_WEBHOOK_URL → alerta instantánea del lead (OPCIONAL)
 *   LEAD_TIER_A / LEAD_TIER_B → umbrales de score (OPCIONAL; default 70 / 40)
 *   SUPABASE_URL / SUPABASE_SERVICE_KEY → persistencia del lead (OPCIONAL;
 *                 sin ellas se omite y el lead llega solo por correo)
 *
 * Multi-marca: `brand` se fija en BRAND y nunca lo fija el cliente. El upsert
 * usa la clave compuesta (brand, email) —constraint leads_brand_email_key—
 * para que la misma persona pueda existir una vez por marca sin sobrescribirse.
 *
 * Comportamiento:
 *   - Persiste el lead en Supabase antes de enviar el correo.
 *   - Reply-To: el email del visitante (no es el remitente SMTP).
 *   - El destinatario lo fija CONTACT_TO; el visitante no puede cambiarlo.
 *   - OBLIGATORIOS: nombre, email, empresa, problema y consentimiento.
 *   - Lead scoring server-side (A/B/C) con los niveles de LiveEngines
 *     (explore / experience / simulate / connect), no los de Odysea.
 *   - Auto-respuesta al visitante con el branding de LiveEngines.
 *   - Validación server-side, saneo, límite de longitud, honeypot y
 *     rate-limit por IP (en memoria).
 */

const tls = require('tls');

/* ─── Configuración de marca ─────────────────────────────────────── */

const BRAND = 'liveengines';
const DEFAULT_EMAIL = 'hola@liveengines.com';
const DEFAULT_SITE = 'https://liveengines.com';
const SITE_DOMAIN = 'liveengines.com';

/* Tokens de color del sitio (i18n/template.html) para que el correo coincida
   con la web sin abrir un archivo de tokens compartido. */
const INK = '#111185';
const INK_2 = '#2E32A3';
const INK_4 = '#6B6ECC';
const PAPER_2 = '#F2F3FF';
const PAPER_3 = '#E8EBFF';
const ACCENT = '#2323FF';

const MAX_BODY = 100 * 1024;
const MAX_FIELD = 500;

const RATE_LIMIT = 5;                 // envíos máx. por ventana
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const ipHits = new Map();

/* ─── Utilidades ─────────────────────────────────────────────────── */

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let size = 0;
    const chunks = [];
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', function () {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function clean(value, max) {
  if (typeof value !== 'string') return '';
  const v = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  return v.slice(0, max || MAX_FIELD);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clientIp(req) {
  const xff = req.headers && req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim().slice(0, 64);
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now - hit.windowStart >= RATE_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  hit.count += 1;
  if (ipHits.size > 5000) {
    for (const key of ipHits.keys()) {
      if (now - ipHits.get(key).windowStart >= RATE_WINDOW_MS) ipHits.delete(key);
    }
  }
  return hit.count > RATE_LIMIT;
}

function envInt(name, fallback) {
  const n = parseInt(process.env[name], 10);
  return Number.isFinite(n) ? n : fallback;
}

function siteConfig() {
  const url = (clean(process.env.SITE_URL, 200) || DEFAULT_SITE).replace(/\/+$/, '');
  const logo = clean(process.env.LOGO_URL, 500) || url + '/images/le-email.png';
  return { url, logo };
}

/* ─── Lead scoring ───────────────────────────────────────────────── */

/* Los cuatro niveles de la tabla de precios de LiveEngines. `connect` puntúa
   más porque es el que más cerca del cierre se posiciona; el orden no es
   inventado, refleja cuánto trabajo de definición lleva el prospect. */
const SERVICE_SCORE = {
  connect: 30,
  simulate: 22,
  experience: 15,
  explore: 8,
};

const BUDGET_SCORE = {
  '10000+': 30,
  '10000plus': 30,
  '6000-10000': 25,
  '3000-6000': 18,
  '1000-3000': 8,
  lt1000: 2,
};

const TIMELINE_SCORE = {
  lt1m: 20,
  '1-3m': 15,
  '3-6m': 8,
  '6m': 3,
  explore: 0,
};

const DECISION_SCORE = {
  founder: 10,
  director: 8,
  manager: 6,
  delegate: 4,
  other: 0,
};

/* values: { services[], budget, timeline, decision } con los valores crudos de
   los selects (no las etiquetas visibles). */
function computeScore(values) {
  if (!values || typeof values !== 'object') values = {};
  const services = Array.isArray(values.services) ? values.services : [];
  let points = 0;
  for (const s of services) points += SERVICE_SCORE[s] || 0;
  points += BUDGET_SCORE[values.budget] || 0;
  points += TIMELINE_SCORE[values.timeline] || 0;
  points += DECISION_SCORE[values.decision] || 0;

  const tierA = envInt('LEAD_TIER_A', 70);
  const tierB = envInt('LEAD_TIER_B', 40);
  const tier = points >= tierA ? 'A' : points >= tierB ? 'B' : 'C';
  return { points: points, tier: tier };
}

/* ─── Correo de notificación interna ─────────────────────────────── */

const TIER_ES = { A: 'A · urgente', B: 'B · cualificado', C: 'C · exploration' };

function buildSubject(payload, score) {
  const who = payload.company || payload.name || 'Contacto';
  const bits = [];
  if (payload.services && payload.services.length) {
    bits.push(payload.services.slice(0, 2).join(', '));
  }
  if (payload.budget) bits.push(payload.budget);
  if (payload.timeline) bits.push(payload.timeline);
  if (payload.decision_maker) bits.push(payload.decision_maker);
  return '[LiveEngines ' + score.tier + ' · ' + score.points + '] ' + who +
    (bits.length ? ' · ' + bits.join(' · ') : '');
}

function buildHtml(payload, score) {
  const site = siteConfig();
  const services = Array.isArray(payload.services) ? payload.services : [];
  const row = function (label, value) {
    const v = value == null ? '' : String(value).trim();
    if (!v) return '';
    return (
      '<tr>' +
      '<td style="padding:6px 12px 6px 0;vertical-align:top;color:' + INK_4 +
      ';white-space:nowrap;font-weight:600;">' + escapeHtml(label) + '</td>' +
      '<td style="padding:6px 0;vertical-align:top;color:' + INK + ';">' +
      escapeHtml(v) + '</td>' +
      '</tr>'
    );
  };

  const body = [
    row('Prioridad', (TIER_ES[score.tier] || score.tier) + ' · ' + score.points + '/100'),
    row('Nivel', services.join(', ')),
    row('Nombre', payload.name),
    row('Correo', payload.email),
    row('Empresa', payload.company),
    row('Teléfono', payload.phone),
    row('Cargo', payload.role),
    row('Problema / necesidad', payload.problem),
    row('Materiales y datos', payload.tools),
    row('Presupuesto', payload.budget),
    row('Plazo', payload.timeline),
    row('Quién decide', payload.decision_maker),
    row('Cómo nos encontró', payload.referral),
    row('Consentimiento de datos', payload.consent_data ? 'Sí' : 'No'),
    row('Idioma', payload.lang),
    row('Fuente', payload.source),
    row('URL de entrada', payload.url),
    row('Referrer', payload.referrer),
    row('Fecha', payload.timestamp),
    row('UTM', Object.keys(payload.utm || {}).length
      ? Object.keys(payload.utm).map(function (k) {
          return k + '=' + payload.utm[k];
        }).join(' ')
      : ''),
  ].join('');

  return (
    '<div style="font-family:-apple-system,\'Segoe UI\',Helvetica,Arial,sans-serif;background:' + PAPER_2 + ';padding:32px;">' +
    '<div style="max-width:640px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">' +
    '<div style="background:' + INK + ';color:#FFFFFF;padding:24px 28px;">' +
    '<img src="' + escapeHtml(site.logo) + '" width="150" alt="LiveEngines" ' +
    'style="display:block;border:0;outline:none;text-decoration:none;width:150px;height:auto;">' +
    '<div style="font-size:24px;font-weight:700;margin-top:18px;">' +
    escapeHtml(payload.company || payload.name || 'Nuevo contacto') +
    '</div>' +
    '<div style="font-size:12px;letter-spacing:.12em;color:' + ACCENT +
    ';text-transform:uppercase;margin-top:6px;">Nuevo lead · ' +
    escapeHtml(String(payload.lang || 'es').toUpperCase()) + ' · LiveEngines</div>' +
    '</div>' +
    '<div style="padding:28px;">' +
    '<table style="border-collapse:collapse;width:100%;font-size:14px;">' + body + '</table>' +
    (payload.problem
      ? '<div style="margin-top:20px;padding:16px;background:' + PAPER_2 +
        ';border-left:3px solid ' + ACCENT + ';font-size:14px;color:' + INK + ';">' +
        escapeHtml(payload.problem) + '</div>'
      : '') +
    '</div>' +
    '<div style="padding:0 28px 28px;">' +
    '<a href="' + (clean(process.env.PANEL_URL, 300) || 'https://panel.odysea.tech/panel') +
      '" style="display:inline-block;background:' + INK +
    ';color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;padding:13px 26px;border-radius:8px;">' +
    'Abrir en el panel</a></div>' +
    '</div></div>'
  );
}

function buildText(payload, score) {
  const services = Array.isArray(payload.services) ? payload.services : [];
  const lines = Object.keys(payload)
    .filter(function (k) {
      return k !== 'utm' && k !== 'services';
    })
    .map(function (k) {
      return k + ': ' + payload[k];
    });
  lines.push('services: ' + services.join(', '));
  lines.push('brand: ' + BRAND);
  lines.push('score: ' + score.tier + ' · ' + score.points + '/100');
  return lines.join('\n');
}

/* ─── Auto-respuesta al visitante ────────────────────────────────── */

const TITLE_FONT = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO_FONT = "'Courier New',Courier,monospace";

function buildAutoSubject() {
  return 'Recibimos tu mensaje · LiveEngines';
}

/* Layout con tablas y estilos inline: es lo único que renderiza igual en
   Gmail, Outlook y Apple Mail. El logo es blanco sobre la cabecera índigo,
   así que mantiene el color de marca en clientes que bloquean SVG. */
function buildAutoHtml(payload) {
  const site = siteConfig();
  const services = Array.isArray(payload.services) ? payload.services : [];
  const firstName = (payload.name || '').trim().split(/\s+/)[0] || payload.name;
  const en = String(payload.lang || '').toLowerCase().indexOf('en') === 0;

  const copy = en
    ? {
        hi: 'Thanks for writing',
        p1: 'Thanks for getting in touch. We have your message',
        p1b: ' and a specialist is reading it now.',
        p2: 'We reply within <strong>24 working hours</strong>, usually sooner.',
        label: 'You are interested in',
        cta: 'See our work',
        reply: 'Anything you can send us now? Just <strong>reply to this email</strong> — it reaches us directly.',
        foot: 'LiveEngines · Interactive technical visualization',
      }
    : {
        hi: 'Recibimos tu mensaje',
        p1: 'Gracias por escribirnos. Ya tenemos tu mensaje',
        p1b: ' y un especialista lo está revisando.',
        p2: 'Te respondemos en un máximo de <strong>24 horas hábiles</strong>, normalmente antes.',
        label: 'Te interesa',
        cta: 'Mira nuestro trabajo',
        reply: '¿Quieres adelantarnos algo? <strong>Responde este correo</strong> — nos llega directo.',
        foot: 'LiveEngines · Visualización técnica interactiva',
      };

  const para = function (html, margin) {
    return '<p style="margin:' + margin + ';font-size:15px;line-height:1.65;color:' + INK + ';">' + html + '</p>';
  };

  const what = services.length ? services.join(', ') : '';
  const interest = what || (en ? 'A project for us to define together' : 'Un proyecto a definir juntos');

  return (
    '<!DOCTYPE html><html lang="' + (en ? 'en' : 'es') + '"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light">' +
    '<style>body{margin:0;padding:0}a{color:' + ACCENT + '}</style>' +
    '</head><body style="margin:0;padding:0;background:' + PAPER_2 + ';">' +

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + PAPER_2 + ';">' +
    '<tr><td align="center" style="padding:32px 16px;">' +

    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:600px;max-width:100%;background:#FFFFFF;border-radius:14px;overflow:hidden;">' +

    '<tr><td style="background:' + INK + ';padding:30px 34px;">' +
    '<img src="' + escapeHtml(site.logo) + '" width="170" alt="LiveEngines" ' +
    'style="display:block;border:0;outline:none;text-decoration:none;width:170px;height:auto;">' +
    '</td></tr>' +

    '<tr><td style="padding:30px 34px 0;">' +
    '<h1 style="margin:0;font-family:' + TITLE_FONT + ';font-weight:700;font-size:28px;' +
    'line-height:1.15;color:' + INK + ';letter-spacing:-.02em;">' + copy.hi + '</h1>' +
    '</td></tr>' +

    '<tr><td style="padding:18px 34px 0;">' +
    para((lang === 'en' ? 'Hello' : 'Hola') + ' <strong>' + escapeHtml(firstName) + '</strong>,', '0 0 14px') +
    para(copy.p1 + (what ? ' sobre <strong>' + escapeHtml(what) + '</strong>' : '') + copy.p1b, '0 0 14px') +
    para(copy.p2, '0 0 6px') +
    '</td></tr>' +

    '<tr><td style="padding:18px 34px 0;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'style="background:' + PAPER_3 + ';border-left:3px solid ' + ACCENT + ';border-radius:0 10px 10px 0;">' +
    '<tr><td style="padding:16px 18px;font-size:14px;line-height:1.7;color:' + INK + ';">' +
    '<span style="font-family:' + MONO_FONT + ';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:' + INK_4 + ';">' +
    copy.label + '</span><br><strong>' + escapeHtml(interest) + '</strong>' +
    (payload.company
      ? '<br><span style="color:' + INK_4 + ';">Empresa / Company:</span> <strong>' +
        escapeHtml(payload.company) + '</strong>'
      : '') +
    '</td></tr></table></td></tr>' +

    '<tr><td style="padding:26px 34px 0;">' +
    '<a href="' + site.url + '" style="display:inline-block;background:' + INK + ';color:#FFFFFF;text-decoration:none;' +
    'font-size:15px;font-weight:600;padding:13px 26px;border-radius:8px;">' + copy.cta + '</a>' +
    '</td></tr>' +

    '<tr><td style="padding:24px 34px 0;">' + para(copy.reply, '0') + '</td></tr>' +

    '<tr><td style="padding:24px 34px 30px;border-top:1px solid ' + PAPER_3 + ';font-size:12px;' +
    'line-height:1.6;color:' + INK_4 + ';">' +
    copy.foot + ' · <a href="' + site.url + '" style="color:' + INK_4 + ';text-decoration:underline;">' +
    SITE_DOMAIN + '</a></td></tr>' +

    '</table></td></tr></table></body></html>'
  );
}

function buildAutoText(payload) {
  const services = Array.isArray(payload.services) ? payload.services : [];
  const firstName = (payload.name || '').trim().split(/\s+/)[0] || payload.name;
  const en = String(payload.lang || '').toLowerCase().indexOf('en') === 0;
  const what = services.join(', ') || (en ? 'A project for us to define together' : 'Un proyecto a definir juntos');

  return en
    ? 'Hi ' + firstName + ',\n\n' +
      'Thanks for getting in touch. We have your message about ' + what +
      (payload.company ? ' for ' + payload.company : '') + ' and a specialist is reading it now.\n\n' +
      'We reply within 24 working hours, usually sooner.\n\n' +
      'Anything you can send us now? Just reply to this email — it reaches us directly.\n\n' +
      'LiveEngines · ' + DEFAULT_SITE
    : 'Hola ' + firstName + ',\n\n' +
      'Gracias por escribirnos. Ya tenemos tu mensaje sobre ' + what +
      (payload.company ? ' para ' + payload.company : '') + ' y un especialista lo está revisando.\n\n' +
      'Te respondemos en un máximo de 24 horas hábiles, normalmente antes.\n\n' +
      '¿Quieres adelantarnos algo? Responde este correo — nos llega directo.\n\n' +
      'LiveEngines · ' + DEFAULT_SITE;
}

/* ─── Alerta Slack (incoming webhook) ────────────────────────────── */

function slackNotify(payload, score, webhook) {
  return new Promise(function (resolve) {
    if (!webhook) return resolve(false);
    const services = Array.isArray(payload.services) ? payload.services : [];
    const icon = score.tier === 'A' ? '🔴' : score.tier === 'B' ? '🟠' : '⚪';
    const who = payload.company || payload.name || 'Lead';

    let text = icon + ' *LiveEngines · ' + score.tier + ' · ' + score.points + ' — ' + who + '*\n';
    if (services.length) text += '⚙ ' + services.join(', ') + '\n';
    if (payload.budget || payload.timeline) {
      text += '💵 ' + (payload.budget || '—') + ' · ⏱ ' + (payload.timeline || '—') + '\n';
    }
    if (payload.problem) text += '📝 ' + payload.problem.slice(0, 240) + '\n';
    text += '📧 <mailto:' + payload.email + '|' + payload.email + '>';

    fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, unfurl_links: false }),
    })
      .then(function (r) { resolve(r.ok); })
      .catch(function () { resolve(false); });
  });
}

/* ─── Persistencia en Supabase (PostgREST, service_role) ─────────── */

function supabaseConfig() {
  const url = clean(process.env.SUPABASE_URL).replace(/\/+$/, '');
  const key = clean(process.env.SUPABASE_SERVICE_KEY) || clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return { url: url, key: key };
}

function nz(value) {
  return value ? value : null;
}

/* Upsert por (brand, email) —constraint leads_brand_email_key—: si la misma
   persona vuelve a escribir, se actualiza su lead de esta marca en vez de
   duplicarlo, sin tocar el lead que tenga en otra marca. */
function saveLead(payload, score) {
  const cfg = supabaseConfig();
  if (!cfg.url || !cfg.key) return Promise.resolve({ skipped: true });

  const row = {
    brand: BRAND,
    name: payload.name,
    email: payload.email,
    company: nz(payload.company),
    phone: nz(payload.phone),
    role: nz(payload.role),
    services: Array.isArray(payload.services) ? payload.services : [],
    problem: nz(payload.problem),
    tools: nz(payload.tools),
    budget: nz(payload.budget),
    timeline: nz(payload.timeline),
    decision_maker: nz(payload.decision_maker),
    referral: nz(payload.referral),
    score: score.points,
    tier: score.tier,
    consent_data: !!payload.consent_data,
    lang: nz(payload.lang),
    source: nz(payload.source),
    url: nz(payload.url),
    referrer: nz(payload.referrer),
    submitted_at: nz(payload.timestamp),
    utm: payload.utm && typeof payload.utm === 'object' ? payload.utm : {},
  };

  return fetch(cfg.url + '/rest/v1/leads?on_conflict=brand,email', {
    method: 'POST',
    headers: {
      apikey: cfg.key,
      Authorization: 'Bearer ' + cfg.key,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  }).then(function (r) {
    if (!r.ok) {
      return r.text().then(function (t) {
        throw new Error('Supabase ' + r.status + ': ' + t.slice(0, 200));
      });
    }
    return { saved: true };
  });
}

/* ─── SMTP (tls://smtp.zoho.com:465) ─────────────────────────────── */

function b64Lines(value) {
  return Buffer.from(String(value == null ? '' : value), 'utf8')
    .toString('base64')
    .replace(/(.{76})/g, '$1\r\n');
}

function buildMime(msg, from, to) {
  const boundary = '=_liveengines_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const headers = [
    'From: LiveEngines <' + from + '>',
    'To: <' + to + '>',
    'Reply-To: <' + (msg.replyTo || from) + '>',
    'Subject: =?UTF-8?B?' + Buffer.from(msg.subject, 'utf8').toString('base64') + '?=',
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <' + Math.random().toString(36).slice(2) + '@' + SITE_DOMAIN + '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
  ];
  const parts = [
    '--' + boundary,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Lines(msg.text),
    '--' + boundary,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Lines(msg.html),
    '--' + boundary + '--',
  ];
  return headers.join('\r\n') + '\r\n\r\n' + parts.join('\r\n');
}

function smtpSend(conn, msg) {
  return new Promise(function (resolve, reject) {
    if (!conn.pass) {
      reject(new Error('SMTP_PASS no configurada'));
      return;
    }

    const to = msg.to;
    const from = conn.from || conn.user;
    const user = conn.user;
    const pass = conn.pass;

    let sock;
    let buffer = '';
    let closed = false;
    let next = null;

    const fail = function (msgText) {
      if (closed) return;
      closed = true;
      try { sock.destroy(); } catch (e) {}
      reject(new Error(msgText));
    };

    const expect = function (code) {
      return new Promise(function (resolveCode, rejectCode) {
        next = { code: String(code), resolve: resolveCode, reject: rejectCode };
      });
    };

    const parse = function (text) {
      buffer += text;
      let idx;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).replace(/\r$/, '');
        buffer = buffer.slice(idx + 1);
        const m = line.match(/^(\d{3})[ -]/);
        if (!m || !next) continue;
        if (m[1] !== next.code) {
          const n = next;
          next = null;
          n.reject(new Error('SMTP ' + m[1] + ' ≠ ' + n.code + ': ' + line));
          continue;
        }
        if (line[3] === '-') continue;
        const n = next;
        next = null;
        n.resolve(line.slice(4));
      }
    };

    sock = tls.connect({ host: conn.host, port: conn.port, servername: conn.host });
    sock.setTimeout(25000);
    sock.on('timeout', function () { fail('SMTP timeout'); });
    sock.on('data', function (chunk) { parse(chunk.toString('utf8')); });
    sock.on('error', function (e) { fail('SMTP error: ' + e.message); });
    sock.on('close', function () { if (!closed) fail('SMTP: conexión cerrada'); });

    const sendCmd = function (cmd, code) {
      const p = expect(code);
      sock.write(cmd + '\r\n');
      return p;
    };

    (async function () {
      try {
        await expect(220);
        await sendCmd('EHLO ' + SITE_DOMAIN, 250);
        await sendCmd('AUTH LOGIN', 334);
        await sendCmd(Buffer.from(user, 'utf8').toString('base64'), 334);
        await sendCmd(Buffer.from(pass, 'utf8').toString('base64'), 235);
        await sendCmd('MAIL FROM:<' + from + '>', 250);
        await sendCmd('RCPT TO:<' + to + '>', 250);
        await sendCmd('DATA', 354);

        sock.write(buildMime(msg, from, to) + '\r\n.\r\n');
        await expect(250);

        closed = true;
        try {
          sock.write('QUIT\r\n');
          sock.end();
        } catch (e) {}
        resolve('smtp-' + Math.random().toString(36).slice(2));
      } catch (e) {
        fail(e.message);
      }
    })();
  });
}

/* ─── Handler ────────────────────────────────────────────────────── */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' });

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return send(res, 429, { ok: false, error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return send(res, 400, { ok: false, error: 'Solicitud inválida' });
  }

  /* Honeypot: fingir éxito para no delatar al bot. */
  if (clean(body.website_hp)) {
    return send(res, 200, { ok: true, ignored: true });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const company = clean(body.company);
  const problem = clean(body.problem, 2000);
  const consentData = body.consent_data === true || body.consent_data === 'true';

  /* Códigos cortos: el frontend los traduce a su idioma, así que el endpoint
     no devuelve prosa que habría que mantener en dos idiomas. */
  const errors = {};
  if (!name) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!validEmail(email)) errors.email = 'invalid';
  if (!company) errors.company = 'required';
  if (!problem) errors.problem = 'required';
  if (problem.length < 20) errors.problem = 'short';
  if (!consentData) errors.consent_data = 'required';

  if (Object.keys(errors).length) {
    return send(res, 422, { ok: false, errors: errors });
  }

  const services = Array.isArray(body.services)
    ? body.services.map(function (s) { return clean(s).slice(0, 60); }).filter(Boolean).slice(0, 6)
    : [];

/* El nivel llega precargado por la tarjeta de precios o elegido en el
     <select>. Solo se acepta si es uno de los cuatro reales, para que el
     scoring nunca dependa de texto libre. */
  const LEVELS = ['explore', 'experience', 'simulate', 'connect'];
  const requested = clean(body.level, 40).toLowerCase();
  if (requested && LEVELS.indexOf(requested) !== -1 && services.indexOf(requested) === -1) {
    services.unshift(requested);
  }

  const payload = {
    name: name,
    email: email,
    company: company,
    phone: clean(body.phone),
    role: clean(body.role),
    services: services.slice(0, 6),
    problem: problem,
    tools: clean(body.tools, 2000),
    budget: clean(body.budget, 60),
    timeline: clean(body.timeline, 60),
    decision_maker: clean(body.decision_maker, 60),
    referral: clean(body.referral, 200),
    consent_data: consentData,
    lang: clean(body.lang, 20),
    source: clean(body.source, 200),
    url: clean(body.url, 1000),
    referrer: clean(body.referrer, 1000),
    timestamp: clean(body.timestamp, 60),
    utm: body.utm && typeof body.utm === 'object' ? body.utm : {},
  };

  const smtpUser = clean(process.env.SMTP_USER) || DEFAULT_EMAIL;
  const smtpPass = clean(process.env.SMTP_PASS);
  const smtpFrom = clean(process.env.MAIL_FROM) || smtpUser;
  const to = clean(process.env.CONTACT_TO) || DEFAULT_EMAIL;
  const host = clean(process.env.SMTP_HOST) || 'smtp.zoho.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);

  if (!smtpPass) {
    /* El motivo va al log, no a la respuesta: publicar qué variable falta
       describe la configuración interna a cualquiera que haga un POST. */
    console.error('contact: SMTP_PASS not configured');
    return send(res, 500, {
      ok: false,
      error: 'Email service not configured',
    });
  }

  const score = computeScore({
    services: payload.services,
    budget: payload.budget,
    timeline: payload.timeline,
    decision: payload.decision_maker,
  });
  const webhook = clean(process.env.SLACK_WEBHOOK_URL);
  const conn = { host: host, port: port, user: smtpUser, pass: smtpPass, from: smtpFrom };

  /* Best-effort: persistir antes de enviar, para que un fallo de SMTP no
     pierda el lead. Y al revés: si Supabase falla, el correo sigue siendo la
     red de seguridad. */
  try {
    await saveLead(payload, score);
  } catch (e) {
    console.error('contact: lead save failed', e.message);
  }

  try {
    const id = await smtpSend(conn, {
      to: to,
      replyTo: payload.email,
      subject: buildSubject(payload, score),
      html: buildHtml(payload, score),
      text: buildText(payload, score),
    });

    try {
      await smtpSend(conn, {
        to: payload.email,
        subject: buildAutoSubject(),
        html: buildAutoHtml(payload),
        text: buildAutoText(payload),
      });
    } catch (e) {
      console.error('contact: auto-reply failed', e.message);
    }

    try {
      await slackNotify(payload, score, webhook);
    } catch (e) {
      console.error('contact: slack notify failed', e.message);
    }

    return send(res, 200, { ok: true, id: id, score: score.points, tier: score.tier });
  } catch (e) {
    console.error('contact: email send failed', e.message);
    return send(res, 500, { ok: false, error: 'No se pudo enviar el mensaje. Intenta de nuevo.' });
  }
};