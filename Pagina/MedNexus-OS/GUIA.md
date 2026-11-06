# Guía de MedNexus OS

MedNexus OS es una primera fase interactiva de una estación de trabajo hospitalaria. Sirve para revisar navegación, flujos y lenguaje visual con información ficticia. Está pensada para una demo local y no procesa datos de pacientes reales.

## 1. Requisitos e instalación

- Node.js 20.9 o posterior.
- npm.
- Conexión a internet durante la primera instalación. Los retratos profesionales también se cargan desde Unsplash.

Desde la carpeta del proyecto:

    npm install
    npm run dev

Abre http://localhost:3000. Para preparar una compilación y servirla:

    npm run build
    npm start

El comando npm run typecheck ejecuta el verificador de tipos TypeScript.

## 2. Recorrido

### Selector de rol

La barra lateral permite entrar al espacio **Clínico** o al portal de **Paciente**. Cada rol tiene su propio grupo de navegación. El selector cambia la vista local; no representa un inicio de sesión ni controla permisos de seguridad.

El botón ES / EN cambia las etiquetas y mensajes entre español e inglés. La información de ejemplo conserva nombres y geografía colombianos en ambos idiomas.

### Espacio clínico

**Resumen**

- Indicadores simulados de citas, pacientes, inventario y disponibilidad.
- Agenda resumida con motivos de consulta ficticios.
- Ocupación visual de consultorios y lista de pacientes del turno.
- Aviso de que los datos son de demostración.

**Pacientes**

- Busca por nombre, código ficticio, ciudad o especialidad.
- Filtra por estado: en espera, listo o en consulta.
- Abre una ficha para revisar edad, ciudad, grupo sanguíneo, alergias y antecedentes ficticios.
- Las fichas no tienen controles para editar diagnósticos o historia.

**Inventario**

- Cambia entre medicamentos, insumos y equipos.
- Combina búsqueda por nombre, código, especificación, categoría, vía y stock crítico.
- La barra de existencias compara la cantidad de ejemplo con el umbral del fixture.
- Selecciona Ver en 3D o Explorar modelo para abrir la escena.
- El catálogo incluye variaciones de calibre, talla, material, volumen y vía. No ofrece instrucciones de administración ni dosis.

**Equipo médico**

- Filtra el directorio ficticio por especialidad, turno y estado.
- Las tarjetas incluyen retratos de muestra, experiencia, departamento y estado simulado.
- La ficha puede abrir una reserva con especialidad y profesional preseleccionados.

**Agenda**

- Muestra citas simuladas con hora, profesional, consultorio y motivo.
- El calendario es una vista de maqueta.
- La tabla de recursos incluye consultorios y programación de quirófanos ficticios.

### Portal del paciente

**Mi cuidado**

- Resumen de la siguiente cita de demostración y el equipo de cuidado.
- Accesos al catálogo de medicamentos y equipos de apoyo.
- Aviso visible: ante una urgencia, acude al hospital más cercano; en una emergencia real contacta los servicios locales y solicita una ambulancia.

**Reservar cita**

1. Elige una especialidad.
2. Selecciona un profesional o deja la opción general.
3. Selecciona fecha y modalidad.
4. Pulsa Buscar disponibilidad.
5. Elige un horario y confirma.

La confirmación solo muestra un mensaje local. No se crea una cita en un calendario ni en un sistema hospitalario.

**Mi historia**

- Presenta identidad, grupo sanguíneo, alergias y antecedentes inventados.
- La insignia de firma es ilustrativa, no es una firma criptográfica.
- No hay editor para el paciente. El historial se visualiza como solo lectura.
- El modelo anatómico se abre desde Visualización clínica 3D. Es geometría sintética para explicar el visor; no contiene radiografías, estudios volumétricos ni datos de una lesión real.

**Ayuda segura**

- Repite las instrucciones para una urgencia.
- Muestra un canal de orientación ficticio y una simulación de llamada con temporizador.
- La simulación nunca activa un enlace telefónico, no abre el marcador y no transmite audio.
- El número +57 000 000 0000 es inválido y solo se usa para que la maqueta parezca una llamada. No lo sustituyas por un número operativo sin aprobación institucional.

## 3. Cómo funciona el visor 3D

src/components/MedicalScene.tsx genera modelos con primitivas de Three.js: cilindros, cajas y esferas. React Three Fiber las dibuja en un Canvas WebGL. Drei aporta OrbitControls y sombras de contacto.

- Arrastra con mouse o dedo para rotar el objeto.
- Usa la rueda o el gesto de acercamiento para hacer zoom.
- El control de órbita limita la distancia y bloquea el desplazamiento lateral.
- El tipo del modelo llega desde el fixture: jeringa, desfibrilador, prótesis, suministros o hueso ilustrativo.
- La escena anatómica muestra una zona de color como anotación educativa, no como resultado clínico.
- El componente se carga solo en cliente porque WebGL depende del navegador.

No se cargan modelos ni imágenes médicas de pacientes. El render del hueso es deliberadamente esquemático.

## 4. Datos y filtros

Los fixtures viven en src/data/mock-data.ts. Incluyen 11 perfiles ficticios, profesionales de Medellín y Antioquia, citas, departamentos, horarios, una EPS de demostración, antecedentes, alergias y un catálogo con 12 referencias.

La lógica de acceso a datos está en src/lib/clinical-repository.ts. Esa capa tipada entrega colecciones a la UI y se puede reemplazar por un cliente de API en otra fase.

Los filtros de inventario se combinan con AND:

1. El texto debe coincidir con nombre, código, categoría, vía o SKU.
2. La pestaña seleccionada debe coincidir con el tipo de referencia.
3. La categoría, si se elige, debe coincidir.
4. La vía debe comenzar con la vía seleccionada.
5. Si Stock crítico está activo, las existencias deben ser menores o iguales al mínimo del fixture.

Los filtros del equipo se combinan por especialidad, turno y disponibilidad. Los filtros de pacientes combinan estado con nombre, código, ciudad o especialidad.

## 5. Arquitectura del proyecto

    src/app/layout.tsx                 Metadata, HTML base y CSS global
    src/app/page.tsx                   Ruta principal
    src/app/globals.css                Diseño oscuro, responsivo y tema Tailwind
    src/components/MedNexusApp.tsx     Navegación, pantallas, filtros y modales
    src/components/MedicalScene.tsx   Escenas interactivas Three.js / R3F
    src/data/mock-data.ts              Datos sintéticos colombianos
    src/lib/clinical-repository.ts     Adaptador de datos para la interfaz
    src/types/clinical.ts              Tipos del dominio

La ruta es una interfaz cliente de Next.js. Los datos se importan localmente; no hay endpoints, base de datos, autenticación ni almacenamiento persistente. Los controles de reserva y solicitud solo actualizan el estado visual.

## 6. Límites y siguiente fase

No introduzcas información personal, diagnósticos reales, imágenes, prescripciones o identificadores reales. No uses la demo para decisiones clínicas ni para coordinar atención real.

MedNexus OS no diagnostica, no recomienda tratamientos ni dosis, no hace triage, no estima el riesgo de un paciente, no reemplaza al personal de salud y no llama a emergencias. En una urgencia, acude al hospital más cercano o contacta los servicios locales por un canal real.

Antes de conectar pacientes o procesos reales, define con la institución el modelo de acceso por rol, autenticación multifactor, autorización por paciente y relación asistencial, auditoría, cifrado, retención, consentimiento, gestión de incidentes, validación clínica, interoperabilidad y obligaciones aplicables en Colombia. Mantén el expediente firmado en un backend con control de versiones y trazabilidad; bloquea en servidor las mutaciones que no tengan autorización clínica.

Una posible siguiente arquitectura:

    navegador -> Next.js BFF/API autenticada -> servicios clínicos
                                           -> PostgreSQL
                                           -> proveedor de identidad
                                           -> auditoría y eventos
                                           -> adaptador de interoperabilidad

La demo no implementa ni certifica esa arquitectura. Esta guía describe una base de interfaz y datos sintéticos, no una solución hospitalaria lista para producción.

## 7. Referencias oficiales del stack

- Next.js App Router e instalación: https://nextjs.org/docs/app/getting-started/installation
- React Three Fiber: https://r3f.docs.pmnd.rs/getting-started/installation
- Tailwind CSS con Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
