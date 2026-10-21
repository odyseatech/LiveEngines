# PRD — LiveEngines

**Producto:** LiveEngines  
**Tipo:** Servicio / plataforma de experiencias técnicas interactivas para web  
**Estado:** Definición inicial  
**Versión:** 0.1  
**Fecha:** 2026-09-24

---

## 1. Resumen

LiveEngines es un proyecto independiente orientado a crear **experiencias técnicas interactivas para empresas de ingeniería, industria, minería, infraestructura, energía, ciencia y sectores relacionados**.

La propuesta no consiste en vender modelado 3D hiperrealista ni desarrollar videojuegos industriales.

LiveEngines transforma información técnica, procesos, sistemas, productos y conceptos complejos en **experiencias web interactivas que permiten comprenderlos, explorarlos y explicarlos visualmente**.

La tecnología principal será la visualización interactiva en navegador, utilizando 3D, animación, simulación, datos y narrativa técnica cuando aporten valor.

### Principio central

> **No buscamos representar cada tornillo. Buscamos representar correctamente el sistema, el proceso o el concepto que importa.**

LiveEngines debe permitir que una empresa pueda presentar algo técnicamente complejo de una forma que sea:

- visual;
- interactiva;
- comprensible;
- técnicamente coherente;
- accesible desde un navegador;
- reutilizable en presentaciones, sitios web, ventas, capacitación o comunicación técnica.

---

# 2. Problema

Muchas empresas técnicas tienen información de alto valor, pero la comunican mediante:

- PDFs;
- fotografías;
- diagramas estáticos;
- videos;
- presentaciones PowerPoint;
- fichas técnicas;
- planos;
- renders;
- documentos especializados.

Estos formatos son útiles, pero tienen una limitación común:

**el usuario observa la información, pero no necesariamente puede explorarla.**

Un proceso industrial puede tener decenas de etapas, variables y relaciones. Una planta puede ser difícil de explicar mediante una fotografía. Una estructura puede requerir comprender fuerzas y cargas. Un producto técnico puede tener múltiples componentes y modos de operación.

LiveEngines busca añadir una capa interactiva a esa información.

---

# 3. Propuesta de valor

LiveEngines crea una capa visual e interactiva sobre información técnica.

En lugar de:

> "Aquí tienes una imagen de nuestra planta."

LiveEngines permite:

> "Explora cómo funciona nuestra planta."

En lugar de:

> "Este equipo tiene estos componentes."

LiveEngines permite:

> "Selecciona cada componente y comprende qué hace."

En lugar de:

> "Este proceso tiene ocho etapas."

LiveEngines permite:

> "Recorre las ocho etapas y observa cómo fluye el material."

En lugar de:

> "Esta estructura soporta determinada carga."

LiveEngines permite:

> "Modifica la carga y observa cómo cambia la respuesta visual del sistema."

---

# 4. Qué hacemos

LiveEngines desarrolla experiencias digitales interactivas para representar:

1. **Procesos**
2. **Sistemas**
3. **Infraestructura**
4. **Productos técnicos**
5. **Fenómenos físicos**
6. **Datos técnicos**
7. **Simulaciones**
8. **Conceptos de ingeniería**
9. **Operaciones**
10. **Sistemas complejos**

La experiencia puede combinar:

- 3D;
- animaciones;
- diagramas;
- simulaciones;
- datos;
- etiquetas técnicas;
- interacción;
- narrativa;
- navegación por etapas;
- controles;
- visualizaciones científicas.

---

# 5. Qué NO hacemos

Definir claramente los límites es parte fundamental del producto.

## 5.1 No somos un estudio de modelado 3D hiperrealista

LiveEngines no tiene como objetivo principal producir modelos cinematográficos o fotorrealistas.

No competimos directamente con:

- estudios de CGI;
- product visualization;
- VFX;
- visualización arquitectónica hiperrealista;
- renderizado publicitario;
- producción audiovisual tradicional.

Un modelo simplificado puede ser completamente válido si comunica correctamente el concepto.

---

## 5.2 No vendemos videojuegos

Las experiencias pueden tener interacción, animación y simulación, pero no se desarrollan como videojuegos.

No forman parte del alcance estándar:

- sistemas de combate;
- personajes;
- inventarios;
- misiones;
- economías de juego;
- multijugador;
- mecánicas de entretenimiento complejas.

La interacción existe para **comprender**, no para jugar.

---

## 5.3 No desarrollamos simuladores industriales de certificación

LiveEngines puede realizar simulaciones visuales o educativas.

No debe presentarse como sustituto de:

- software de ingeniería certificado;
- análisis estructural profesional;
- CFD;
- FEA;
- simuladores de operación certificados;
- sistemas de control industrial;
- software especializado de seguridad.

Si una simulación utiliza un modelo simplificado, debe comunicarse como tal.

---

## 5.4 No somos un sistema SCADA

LiveEngines puede visualizar datos operativos, pero no pretende sustituir sistemas industriales de control.

No controlamos maquinaria real desde la experiencia web salvo que un proyecto específico lo requiera y exista una arquitectura de integración apropiada.

---

## 5.5 No construimos gemelos digitales completos como producto inicial

Un digital twin puede formar parte de una evolución futura, pero no es el punto de entrada.

Un gemelo digital completo puede requerir:

- sensores;
- IoT;
- integración con ERP;
- integración con MES;
- historian;
- APIs;
- datos en tiempo real;
- infraestructura industrial;
- modelos físicos;
- seguridad;
- mantenimiento continuo.

LiveEngines comienza con una capa visual e interactiva mucho más controlada.

---

## 5.6 No modelamos todo desde cero obligatoriamente

Cuando el cliente ya dispone de:

- CAD;
- STEP;
- FBX;
- OBJ;
- GLTF/GLB;
- planos;
- renders;
- documentación;

estos materiales pueden utilizarse como fuente.

El nivel de transformación dependerá del proyecto.

---

# 6. Filosofía de diseño

## 6.1 La precisión conceptual importa más que el detalle visual

Un modelo de baja o media complejidad puede ser suficiente si:

- tiene proporciones adecuadas;
- representa los componentes relevantes;
- muestra correctamente los flujos;
- comunica las relaciones;
- permite entender el funcionamiento.

La calidad de LiveEngines no debe medirse solamente por el número de polígonos.

---

## 6.2 Interactividad con propósito

Cada interacción debe responder una pregunta.

Ejemplos:

- ¿Qué hace este componente?
- ¿Cómo entra el material?
- ¿Dónde se produce esta transformación?
- ¿Qué ocurre si aumenta la carga?
- ¿Cómo cambia el flujo?
- ¿Qué partes forman este sistema?
- ¿Cuál es la secuencia de operación?

No se agregan interacciones simplemente porque son técnicamente posibles.

---

## 6.3 La interfaz no debe competir con la información

El diseño debe ser:

- sobrio;
- técnico;
- limpio;
- legible;
- visualmente preciso.

Evitar:

- dashboards artificiales;
- exceso de métricas;
- gradientes innecesarios;
- estética genérica de "AI";
- animaciones decorativas;
- interfaces sobrecargadas.

---

# 7. Casos de uso

## 7.1 Explicación de procesos industriales

Una empresa puede mostrar visualmente un proceso completo.

### Ejemplo

Proceso de procesamiento de mineral:

1. extracción;
2. transporte;
3. chancado;
4. molienda;
5. flotación;
6. espesamiento;
7. filtrado;
8. almacenamiento.

El usuario puede recorrer cada etapa y observar:

- entradas;
- salidas;
- flujo de material;
- equipos principales;
- variables relevantes;
- función de cada etapa.

### Objetivo

Explicar el proceso sin exigir conocimientos técnicos avanzados.

---

# 8. Visualización de plantas e instalaciones

Una planta industrial puede representarse como un modelo 3D simplificado.

El usuario puede:

- recorrer la planta;
- seleccionar áreas;
- activar capas;
- visualizar flujos;
- identificar equipos;
- mostrar información contextual.

### Aplicaciones

- presentaciones corporativas;
- ventas;
- capacitación;
- onboarding;
- visitas virtuales;
- comunicación con inversionistas;
- comunicación institucional.

---

# 9. Productos técnicos interactivos

Un producto puede convertirse en un modelo explorable.

### Ejemplos

- bombas;
- motores;
- válvulas;
- sistemas hidráulicos;
- transportadores;
- sistemas eléctricos;
- componentes industriales;
- maquinaria simplificada.

El usuario puede seleccionar componentes y visualizar:

- función;
- flujo;
- especificaciones;
- relación con otros componentes;
- secuencia de funcionamiento.

---

# 10. Ingeniería estructural

LiveEngines puede visualizar conceptos estructurales.

### Ejemplo

Una estructura recibe una carga.

El usuario modifica:

- magnitud de carga;
- posición;
- dirección;
- configuración.

La experiencia visualiza de forma conceptual:

- distribución de cargas;
- deformación;
- puntos críticos;
- reacción del sistema.

La simulación debe indicar claramente si es:

- conceptual;
- educativa;
- aproximada;
- basada en datos reales.

No debe presentarse como un análisis estructural certificado cuando no lo sea.

---

# 11. Visualización de energía y flujos

LiveEngines puede representar:

- electricidad;
- agua;
- aire;
- vapor;
- fluidos;
- calor;
- materiales;
- información.

### Ejemplo

Un sistema energético puede mostrar:

`Generación → Transformación → Distribución → Consumo`

El usuario puede seleccionar cada etapa para comprender el flujo.

---

# 12. Ciencia y simulación

LiveEngines también puede crear experiencias para explicar conceptos científicos.

Ejemplos:

- optimización;
- movimiento;
- fuerzas;
- ondas;
- partículas;
- campos;
- fluidos;
- estadística;
- algoritmos;
- machine learning;
- fenómenos físicos.

Un ejemplo interno de referencia es una visualización interactiva de **Gradient Descent**, donde el usuario puede observar cómo un algoritmo se desplaza sobre una función matemática.

Este tipo de proyecto demuestra que LiveEngines no depende exclusivamente de modelos industriales.

---

# 13. Capacitación técnica

Una experiencia puede convertirse en una herramienta de aprendizaje.

### Ejemplo

Una empresa necesita capacitar personal sobre una instalación.

La experiencia puede mostrar:

1. componentes;
2. secuencia de operación;
3. procedimientos;
4. puntos de atención;
5. relaciones entre sistemas;
6. escenarios.

El objetivo es convertir documentación pasiva en una experiencia exploratoria.

---

# 14. Marketing técnico y ventas B2B

Una empresa técnica puede utilizar LiveEngines para explicar productos complejos a clientes potenciales.

Especialmente útil cuando el producto:

- es caro;
- es complejo;
- tiene muchos componentes;
- requiere explicación;
- tiene una ventaja técnica difícil de comunicar.

La experiencia puede incorporarse directamente en una web comercial.

---

# 15. Industrias objetivo

LiveEngines no debe limitarse inicialmente a una única industria.

## 15.1 Minería

Casos:

- procesos mineros;
- plantas concentradoras;
- flujo de mineral;
- infraestructura;
- sistemas de transporte;
- procesamiento;
- seguridad y capacitación;
- visualización de proyectos.

---

## 15.2 Ingeniería y construcción

Casos:

- estructuras;
- puentes;
- edificios;
- infraestructura;
- sistemas constructivos;
- secuencias de construcción;
- cargas;
- materiales.

---

## 15.3 Energía

Casos:

- generación;
- transmisión;
- distribución;
- plantas;
- energía renovable;
- almacenamiento;
- sistemas eléctricos.

---

## 15.4 Manufactura

Casos:

- líneas de producción;
- maquinaria;
- procesos;
- automatización;
- flujo de materiales;
- control de calidad.

---

## 15.5 Agua y saneamiento

Casos:

- plantas de tratamiento;
- redes;
- bombeo;
- filtración;
- distribución;
- procesos de purificación.

---

## 15.6 Petróleo y gas

Casos:

- procesos;
- infraestructura;
- transporte;
- refinación;
- sistemas de almacenamiento;
- explicación de operaciones.

---

## 15.7 Tecnología

Casos:

- infraestructura de datos;
- sistemas distribuidos;
- arquitectura de software;
- redes;
- procesos de IA;
- visualizaciones algorítmicas.

---

## 15.8 Ciencia y educación

Casos:

- simulaciones;
- laboratorios virtuales;
- visualización científica;
- conceptos físicos;
- matemáticas;
- ingeniería.

---

## 15.9 Arquitectura

Casos:

- recorridos;
- sistemas constructivos;
- comportamiento conceptual;
- interacción con espacios;
- presentación de proyectos.

LiveEngines no busca reemplazar el render arquitectónico tradicional.

---

# 16. Servicios

LiveEngines se estructura inicialmente en cuatro servicios.

---

## Servicio 01 — Interactive Product

### Descripción

Convertimos un producto técnico en una experiencia interactiva.

### Incluye

- modelo 3D simplificado o adaptación de modelo existente;
- cámara interactiva;
- componentes seleccionables;
- información técnica;
- animaciones;
- navegación;
- integración web.

### Ideal para

Fabricantes, proveedores industriales y empresas B2B.

---

# Servicio 02 — Process Experience

### Descripción

Convertimos un proceso complejo en una experiencia visual interactiva.

### Incluye

- representación de etapas;
- flujo visual;
- animaciones;
- componentes;
- navegación secuencial;
- explicaciones técnicas;
- indicadores relevantes.

### Ideal para

Minería, manufactura, energía, agua, construcción y procesos industriales.

---

# Servicio 03 — Engineering Visualization

### Descripción

Representamos conceptos de ingeniería mediante visualizaciones y simulaciones interactivas.

### Puede incluir

- fuerzas;
- cargas;
- movimiento;
- flujos;
- deformaciones conceptuales;
- parámetros;
- gráficos;
- interacción matemática.

### Ideal para

Ingenierías, universidades, empresas técnicas y proyectos de innovación.

---

# Servicio 04 — Technical Explainer

### Descripción

Experiencias interactivas destinadas a explicar conceptos técnicos complejos.

No necesariamente requieren 3D.

Pueden utilizar:

- 2D;
- diagramas;
- animación;
- gráficos;
- datos;
- pequeñas simulaciones;
- interacción.

### Ideal para

Empresas que necesitan explicar tecnología, procesos o sistemas.

---

# 17. Niveles de complejidad

Para evitar vender proyectos excesivamente grandes desde el inicio, LiveEngines utilizará niveles.

## Nivel 1 — Interactive Visualization

Una experiencia visual con interacción básica.

### Ejemplo

Modelo 3D + etiquetas + selección de componentes.

**Rango inicial:** US$ 800–1,500

---

## Nivel 2 — Interactive Technical Experience

Experiencia con narrativa, animaciones y múltiples interacciones.

### Ejemplo

Proceso industrial completo con varias etapas.

**Rango inicial:** US$ 1,500–3,500

---

## Nivel 3 — Technical Simulation

Incluye variables, controles y comportamiento dinámico.

### Ejemplo

Modificar una variable y observar la respuesta del sistema.

**Rango inicial:** US$ 3,000–6,000

---

## Nivel 4 — Data-Connected Experience

La experiencia consume datos externos.

Puede integrar:

- APIs;
- datasets;
- bases de datos;
- sensores;
- sistemas empresariales.

**Rango inicial:** US$ 5,000–10,000+

El precio final dependerá de la complejidad de la integración.

---

# 18. Pricing

Los precios anteriores son referencias iniciales y no deben considerarse tarifas rígidas.

El precio se determina principalmente por:

1. complejidad visual;
2. cantidad de escenas;
3. necesidad de modelado;
4. cantidad de interacciones;
5. complejidad de la simulación;
6. integración de datos;
7. necesidad de backend;
8. optimización;
9. soporte;
10. mantenimiento.

## Propuesta de paquetes comerciales

| Paquete | Descripción | Precio referencial |
|---|---|---:|
| **Explore** | Visualización interactiva simple | US$ 800–1,500 |
| **Experience** | Experiencia técnica completa | US$ 1,500–3,500 |
| **Simulate** | Experiencia con simulación | US$ 3,000–6,000 |
| **Connect** | Experiencia conectada a datos | US$ 5,000–10,000+ |

---

# 19. Qué incluye cada paquete

## Explore

Pensado para demostrar un producto, componente o concepto.

### Incluye

- una escena principal;
- modelo existente o modelo simplificado;
- interacción básica;
- hotspots;
- información técnica;
- responsive web;
- despliegue.

### No incluye

- simulación compleja;
- backend;
- integración de datos;
- modelado industrial avanzado.

---

## Experience

Pensado para procesos y sistemas.

### Incluye

- múltiples escenas o etapas;
- navegación;
- animaciones;
- cámara dirigida;
- componentes interactivos;
- narrativa;
- información contextual;
- optimización web.

---

## Simulate

Pensado para experiencias donde las variables modifican el comportamiento visual.

### Incluye

- parámetros;
- controles;
- motor de simulación específico;
- visualización de resultados;
- gráficos;
- estados;
- explicación del modelo.

---

## Connect

Pensado para experiencias que necesitan información externa.

### Incluye

- API;
- dataset;
- fuente de datos;
- procesamiento;
- visualización;
- arquitectura de conexión;
- controles de seguridad apropiados.

---

# 20. Modelo de negocio

LiveEngines debe funcionar inicialmente como un **servicio especializado**, no como un SaaS genérico.

El flujo comercial es:

`Cliente → Problema técnico → Diseño de experiencia → Desarrollo → Implementación`

Posteriormente pueden existir:

- mantenimiento;
- nuevas escenas;
- nuevas simulaciones;
- integración de datos;
- actualización de modelos;
- nuevas experiencias.

---

# 21. Mantenimiento

Puede ofrecerse mantenimiento mensual.

### Basic

**US$ 100–250/mes**

Incluye:

- hosting;
- pequeñas modificaciones;
- correcciones;
- soporte básico.

### Technical

**US$ 250–500/mes**

Incluye:

- mantenimiento;
- nuevas escenas pequeñas;
- ajustes;
- actualización de contenido;
- optimización.

### Connected

**US$ 500+/mes**

Para experiencias conectadas a datos o sistemas externos.

El precio depende de infraestructura y frecuencia de actualización.

---

# 22. Modelo técnico

## Frontend

- TypeScript
- React
- Next.js
- Three.js
- React Three Fiber cuando sea conveniente

## Visualización

- WebGL
- WebGPU cuando aporte una ventaja real
- GLTF/GLB
- SVG
- Canvas
- shaders cuando sean necesarios

## Animación

Puede utilizarse:

- animación nativa;
- GSAP;
- Framer Motion / Motion;
- animación basada en estado.

No se introduce una librería si la funcionalidad puede resolverse de forma sencilla.

---

# 23. Arquitectura conceptual

LiveEngines debe separar cinco capas:

```text
┌─────────────────────────────┐
│       Experience UI         │
│ navegación / controles / UI │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Interaction Layer      │
│ selección / eventos / input │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│     Visualization Layer     │
│ 3D / 2D / animation / data  │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Simulation Layer       │
│ física / matemáticas / rules│
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│        Data Layer            │
│ static data / API / sensors │
└─────────────────────────────┘
```

No todos los proyectos necesitan las cinco capas.

---

# 24. Separación entre modelo visual y modelo técnico

Una regla fundamental:

> **El modelo utilizado para visualizar no tiene que ser el mismo modelo utilizado para calcular.**

Ejemplo:

Una estructura puede tener un modelo 3D simplificado para el navegador, mientras que la simulación utiliza una representación matemática independiente.

Esto permite:

- mejor rendimiento;
- menor complejidad;
- mayor control;
- reutilización;
- independencia entre visualización y cálculo.

---

# 25. Assets

Los assets pueden proceder de:

### Cliente

- CAD;
- BIM;
- planos;
- fotografías;
- renders;
- modelos 3D;
- documentación.

### LiveEngines

- modelos simplificados;
- diagramas;
- geometría procedural;
- visualizaciones;
- elementos UI.

### Terceros

Se pueden utilizar assets licenciados cuando sea apropiado.

---

# 26. Pipeline de producción

```text
01. Descubrimiento
        ↓
02. Definición del problema
        ↓
03. Guion técnico
        ↓
04. Diseño de interacción
        ↓
05. Preparación de assets
        ↓
06. Prototipo
        ↓
07. Desarrollo
        ↓
08. Optimización
        ↓
09. Validación técnica
        ↓
10. Deployment
```

---

# 27. Fase 01 — Descubrimiento

Antes de escribir código se debe determinar:

- qué debe entender el usuario;
- quién utilizará la experiencia;
- qué información existe;
- qué información falta;
- qué datos son confiables;
- qué partes necesitan interacción;
- qué partes pueden mantenerse estáticas.

---

# 28. Fase 02 — Guion técnico

Cada experiencia debe tener una narrativa.

Ejemplo:

```text
Entrada
  ↓
Proceso A
  ↓
Proceso B
  ↓
Transformación
  ↓
Proceso C
  ↓
Salida
```

Cada etapa responde:

- ¿Qué ocurre?
- ¿Por qué ocurre?
- ¿Qué entra?
- ¿Qué sale?
- ¿Qué componente participa?
- ¿Qué variable importa?

---

# 29. Fase 03 — Prototipo

Antes de desarrollar el producto completo se construye una versión pequeña.

Objetivos:

- comprobar la interacción;
- comprobar rendimiento;
- validar el concepto;
- detectar problemas;
- obtener feedback del cliente.

La regla es:

> **Prototipar antes de producir.**

---

# 30. Requisitos funcionales generales

Una experiencia LiveEngines debe poder:

- cargar correctamente en navegador;
- funcionar en desktop;
- adaptarse a diferentes resoluciones;
- permitir interacción;
- mostrar información contextual;
- gestionar estados;
- animar elementos cuando corresponda;
- controlar la cámara;
- mantener un rendimiento razonable;
- presentar claramente sus limitaciones técnicas.

---

# 31. Requisitos no funcionales

## Rendimiento

Priorizar:

- carga rápida;
- assets optimizados;
- compresión;
- lazy loading;
- reducción de polígonos;
- texturas optimizadas;
- LOD cuando sea necesario.

## Accesibilidad

Siempre que sea posible:

- controles claros;
- textos legibles;
- navegación alternativa;
- reducción de movimiento;
- información no dependiente exclusivamente del color.

## Compatibilidad

Objetivo inicial:

- Chrome;
- Edge;
- Firefox;
- Safari moderno.

---

# 32. Límites de calidad

LiveEngines no debe prometer:

- precisión física absoluta;
- representación industrial perfecta;
- simulación certificada;
- funcionamiento en cualquier dispositivo;
- modelos hiperrealistas incluidos automáticamente.

Cada proyecto debe especificar qué representa y qué no representa.

---

# 33. Métricas de éxito

Las métricas deben medir utilidad, no solamente tecnología.

## Producto

- tiempo de carga;
- FPS;
- tasa de interacción;
- tiempo de exploración;
- errores;
- compatibilidad.

## Negocio

- número de proyectos vendidos;
- ticket promedio;
- tiempo de producción;
- margen;
- porcentaje de clientes recurrentes;
- reutilización de componentes.

## Cliente

- comprensión del proceso;
- utilidad comercial;
- uso en presentaciones;
- uso en capacitación;
- interacción de usuarios.

---

# 34. MVP de LiveEngines

El MVP no será una plataforma.

Será un **portafolio funcional de experiencias** que demuestre la capacidad del servicio.

## Demo 01 — Industrial Process

Una planta o proceso simplificado.

Debe demostrar:

- 3D;
- flujo;
- etapas;
- interacción;
- etiquetas;
- narrativa.

---

## Demo 02 — Engineering Simulation

Una simulación conceptual.

Ejemplos:

- cargas;
- movimiento;
- flujo;
- optimización.

Debe demostrar:

- variables;
- interacción;
- cálculo;
- visualización de resultados.

---

## Demo 03 — Technical Product

Un producto técnico simplificado.

Debe demostrar:

- componentes;
- selección;
- explicación;
- animación;
- información técnica.

---

## Demo 04 — Scientific Visualization

Una experiencia científica.

El Gradient Descent puede funcionar como uno de los primeros ejemplos.

Debe demostrar que LiveEngines también puede trabajar con:

- matemáticas;
- algoritmos;
- datos;
- simulaciones.

---

# 35. Estrategia inicial

No intentar construir una plataforma completa.

El primer objetivo es demostrar que LiveEngines puede resolver cuatro problemas:

### Problema A

"Necesito explicar un proceso complejo."

→ Process Experience.

### Problema B

"Necesito explicar cómo funciona mi producto."

→ Interactive Product.

### Problema C

"Necesito mostrar un fenómeno o comportamiento."

→ Engineering Visualization.

### Problema D

"Necesito explicar una tecnología o concepto."

→ Technical Explainer.

---

# 36. Ventaja competitiva

La ventaja de LiveEngines no será producir modelos 3D más detallados que un estudio especializado.

Será combinar:

- desarrollo web;
- 3D;
- visualización de datos;
- interacción;
- simulación;
- narrativa técnica.

El producto final vive en el navegador.

Esto reduce la barrera de acceso frente a soluciones que requieren:

- instalar software;
- ejecutar aplicaciones;
- descargar archivos;
- utilizar estaciones de trabajo especializadas.

---

# 37. Posicionamiento

LiveEngines debe evitar posicionarse como:

- agencia 3D;
- estudio de renders;
- empresa de videojuegos;
- estudio de animación;
- proveedor de CAD.

Posicionamiento recomendado:

> **LiveEngines crea experiencias técnicas interactivas para explicar sistemas, procesos, productos y fenómenos complejos directamente desde el navegador.**

Versión corta:

> **Technical systems, made interactive.**

Otra formulación:

> **Convertimos sistemas complejos en experiencias que se pueden explorar.**

---

# 38. Principios del proyecto

## 01 — La tecnología debe servir a la comprensión

No se utiliza 3D porque sea llamativo.

Se utiliza cuando mejora la comprensión.

## 02 — Simplicidad antes que realismo

Un modelo simple que explica correctamente es mejor que un modelo complejo que distrae.

## 03 — Interacción con propósito

Cada interacción debe aportar información.

## 04 — Navegador primero

La experiencia debe ser accesible desde un navegador moderno.

## 05 — Modularidad

Los componentes desarrollados para un proyecto deben poder reutilizarse en otros.

## 06 — No sobreingeniería

Cada proyecto debe utilizar solamente la infraestructura necesaria.

## 07 — Precisión técnica

Las simplificaciones deben ser explícitas.

## 08 — Diseño técnico

La estética debe apoyar la información, no competir con ella.

---

# 39. Roadmap

## Fase 0 — Concepto

- definir identidad;
- definir posicionamiento;
- definir lenguaje visual;
- crear arquitectura base.

## Fase 1 — Portfolio

Crear:

1. proceso industrial;
2. simulación;
3. producto técnico;
4. visualización científica.

## Fase 2 — Comercialización

Crear:

- landing;
- portfolio;
- casos de uso;
- pricing;
- demo interactiva;
- formulario de contacto.

## Fase 3 — Primeros clientes

Priorizar:

- empresas de ingeniería;
- minería;
- proveedores industriales;
- universidades;
- empresas tecnológicas;
- empresas de infraestructura.

## Fase 4 — Reutilización

Construir componentes reutilizables:

- cámaras;
- hotspots;
- labels;
- timeline;
- controladores;
- gráficos;
- sistemas de partículas;
- loaders;
- componentes de simulación;
- paneles técnicos.

## Fase 5 — Integraciones

Explorar:

- APIs;
- datasets;
- IoT;
- sensores;
- sistemas empresariales;
- datos en tiempo real.

---

# 40. Criterios para aceptar un proyecto

Un proyecto es adecuado para LiveEngines cuando:

- existe un problema de comunicación técnica;
- la interacción aporta valor;
- el navegador es un canal adecuado;
- el cliente dispone de información suficiente;
- la complejidad es manejable;
- el resultado puede validarse.

Un proyecto debe reconsiderarse cuando:

- requiere precisión certificada;
- necesita un simulador industrial completo;
- depende de hardware especializado;
- requiere un modelo hiperrealista como requisito principal;
- necesita un sistema de control industrial;
- el componente interactivo no aporta valor real.

---

# 41. Resultado esperado

LiveEngines debe convertirse en una capacidad especializada para crear **experiencias técnicas interactivas**, no en una fábrica de modelos 3D.

El activo principal del proyecto será un conjunto de:

- componentes reutilizables;
- motores de interacción;
- sistemas de visualización;
- herramientas de simulación;
- patrones de narrativa técnica;
- experiencia de diseño;
- experiencia de desarrollo.

Con el tiempo, cada proyecto debe reducir el costo y tiempo de producción del siguiente.

---

# 42. Definición final

**LiveEngines es un servicio de visualización técnica interactiva que transforma procesos, sistemas, productos, datos y conceptos complejos en experiencias web explorables.**

No busca competir por realismo.

Busca competir por:

**comprensión + interacción + tecnología web + precisión conceptual.**
