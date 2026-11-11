# MedNexus OS

Demo bilingüe de operaciones hospitalarias con centro de seguridad clínica, red hospitalaria en Google Maps, perfil de supervisión, asistente de voz, modelos 3D educativos y vistas de pacientes, agenda y equipo.

## Inicio rápido

Requisitos: Node.js 20.9 o posterior y npm.

    cd MedNexus-OS
    npm install
    npm run dev

Abre http://localhost:3000. Para generar una compilación de producción:

    npm run build
    npm start

La primera instalación descarga las dependencias de npm. El visor 3D genera su geometría en el navegador; no descarga modelos médicos. La foto de José Daniel y el logotipo de MedNexus son assets locales. Las fichas clínicas y estados del equipo usan datos ficticios.

## Google Maps

Para activar el mapa integrado, copia `.env.example` a `.env.local`, configura `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` y habilita Maps JavaScript API, Places API (New) y Routes API en Google Cloud con facturación y restricciones de origen web. Reinicia el servidor de desarrollo después de cambiar la variable. Sin clave, el mapa conserva una lista local de hospitales, buscador, teléfonos publicados y enlaces externos de ruta. La distancia local se rotula como aproximación en línea recta; Maps calcula la ruta en auto cuando hay clave.

El mapa pide ubicación solo si ya fue autorizada previamente o cuando la persona pulsa **Usar mi ubicación**. Las búsquedas de centros y tiempos de ruta se consultan en Google Maps; el detalle telefónico se pide al seleccionar un centro. El directorio local incluye enlaces oficiales de contacto para los hospitales principales de Medellín. Google Maps puede facturar esas solicitudes según la configuración del proyecto.

## Navegación

- Cambia entre **Clínico** y **Paciente** desde la barra lateral.
- Cambia el idioma con el botón **ES / EN**.
- Alterna **Claro / Oscuro** en la barra superior; la elección se conserva en este navegador.
- En **Seguridad clínica**, revisa el estado ficticio de las historias clínicas electrónicas, el monitoreo de pacientes y los servidores de farmacia. El selector de entorno solo cambia la etiqueta visible.
- Explora la topología 3D: selecciona nodos o arrastra para rotar; usa la rueda o el gesto de pinza para acercar.
- Inicia el asistente para conceder permiso de micrófono y ver el nivel de audio. Cuando el navegador ofrece Web Speech, muestra transcripción; también puedes escribir. Puede responder con los perfiles y el stock ficticio y abrir agenda, equipo, inventario, pacientes, hospitales o consulta asistida. Las respuestas son reglas locales, no IA generativa. La transcripción puede usar un proveedor del navegador y no se almacena desde esta app.
- En la tarjeta de voz, usa los ejemplos de comandos o solicita información de personal y existencias. El enlace a AztecLab abre su sitio para conocer servicios; la demo no se conecta a una API de AztecLab.
- Revisa las recomendaciones de seguridad; las etiquetas HIPAA e internas son referencias de demostración, no validaciones de cumplimiento.
- Consulta la cronología de auditoría por fecha, sistema y nivel. Cada evento muestra actor, origen y detalle ficticios; marcarlo como revisado solo cambia el estado local.
- En **Inventario**, combina categoría, vía/especificación, texto y existencia crítica. Desde el espacio clínico, abre un producto para rotarlo y acercarlo.
- En **Equipo médico**, combina especialidad, turno y estado; las barras de actividad/disponibilidad, los historiales, credenciales y contadores son datos ilustrativos no verificados. Camilo Jaramillo y Yuliana Pérez tienen fichas con permisos y actividad simulados.
- En **Red hospitalaria**, busca centros locales; con clave consulta Google Places, teléfonos publicados y rutas de Google. Sin clave muestra distancias aproximadas y enlaces de Google Maps.
- En **Consulta asistida**, responde el cuestionario paso a paso. Las señales de alarma elegidas muestran orientación de seguridad general; el flujo no diagnostica ni calcula una urgencia clínica. El resumen se puede llevar al asistente local.
- Las fichas de pacientes incluyen notas, signos vitales, antecedentes/alergias, tratamientos ficticios, auditoría y tres estudios sintéticos por paciente. Los modelos de hueso/fractura, pulmón y articulación son ilustraciones, no estudios reales.
- En **Pacientes**, busca por nombre, código, ciudad o especialidad. Las fichas son de solo lectura.
- En **Agenda**, consulta citas y turnos de ejemplo en fechas pasadas y futuras. Agrega, edita y elimina eventos ficticios; se guardan en `localStorage` de este navegador.
- En **Mi cuidado**, reserva una cita ficticia, consulta el perfil firmado y abre el modelo anatómico.
- En **Ayuda segura**, prueba el simulador visual de llamada. No llama a un teléfono real. El enlace a AztecLab es informativo y no activa una conexión de voz.

## Seguridad de la demo

Todos los nombres, identificadores, antecedentes, alergias, disponibilidad, credenciales, métricas, medicamentos, equipos, citas, firmas y existencias son ficticios o ilustrativos. Los teléfonos y direcciones del directorio local enlazan a las páginas oficiales consultadas, pero deben confirmarse con cada institución. No introduzcas información de personas reales. La aplicación no ofrece diagnósticos, triage clínico, tratamientos ni dosis. Para una urgencia, contacta los servicios de emergencia locales. El número **+57 000 000 0000** es deliberadamente inválido y aparece solo en la simulación.

Esta demo no es una historia clínica electrónica, no está conectada a una EPS/IPS, no genera prescripciones, no reserva recursos reales, no almacena audio, no valida firmas digitales ni sustituye una evaluación clínica. La voz activa usa Web Speech API si el navegador la admite; AztecLab no está integrado como proveedor. La llamada simulada nunca usa el marcador. La búsqueda dinámica del mapa depende de las APIs y la clave de Google; ubicación y voz dependen de permisos del navegador. En Medellín se muestra 123 como línea de emergencias. Antes de producción hacen falta autenticación y autorización, auditoría, backend clínico, controles de privacidad y seguridad, interoperabilidad y validación institucional.

La arquitectura, los ejemplos y los límites se describen en [GUIA.md](./GUIA.md) y [GUIA.txt](./GUIA.txt).

## Estructura

    src/
      app/                  App Router, layout y estilos
      components/           Aplicación y escena 3D
      data/                 Fixtures colombianos de demostración
      lib/                  Adaptador de repositorio tipado
      types/                Contratos TypeScript de dominio

El punto de acceso de datos de la UI es src/lib/clinical-repository.ts. Sustituye el adaptador ficticio por uno de API autenticada al conectar servicios reales.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS 4, React Three Fiber, Three.js, Drei y Lucide.
