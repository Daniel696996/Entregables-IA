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

Para activar el mapa integrado, copia `.env.example` a `.env.local`, configura `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` y habilita Maps JavaScript API, Places API (New) y Routes API en Google Cloud con facturación y restricciones de origen web. Reinicia el servidor de desarrollo después de cambiar la variable. Sin la clave, la app conserva Medellín como ubicación de referencia, explica cómo conectar el servicio y ofrece abrir una búsqueda de centros en Google Maps con el área seleccionada.

El mapa pide ubicación solo si ya fue autorizada previamente o cuando la persona pulsa **Usar mi ubicación**. Las búsquedas de centros y tiempos de ruta se consultan en Google Maps; el detalle telefónico se pide al seleccionar un centro. Google Maps puede facturar esas solicitudes según la configuración del proyecto.

## Navegación

- Cambia entre **Clínico** y **Paciente** desde la barra lateral.
- Cambia el idioma con el botón **ES / EN**.
- En **Seguridad clínica**, revisa el estado ficticio de las historias clínicas electrónicas, el monitoreo de pacientes y los servidores de farmacia. El selector de entorno solo cambia la etiqueta visible.
- Explora la topología 3D: selecciona nodos o arrastra para rotar; usa la rueda o el gesto de pinza para acercar.
- Inicia el asistente para conceder permiso de micrófono y ver el nivel de audio. Cuando el navegador ofrece Web Speech, muestra transcripción; también puedes escribir. La transcripción puede usar un proveedor del navegador y no se almacena desde esta app.
- Revisa las recomendaciones de seguridad; las etiquetas HIPAA e internas son referencias de demostración, no validaciones de cumplimiento.
- Consulta la cronología de auditoría por fecha, sistema y nivel. Cada evento muestra actor, origen y detalle ficticios; marcarlo como revisado solo cambia el estado local.
- En **Inventario**, combina categoría, vía/especificación, texto y existencia crítica. Desde el espacio clínico, abre un producto para rotarlo y acercarlo.
- En **Equipo médico**, combina especialidad, turno y estado; las barras de actividad/disponibilidad son indicadores ficticios inspirados en HUD tácticos.
- En **Red hospitalaria**, consulta centros cercanos, datos publicados y estimaciones de ruta una vez configurada la clave de Maps.
- Las fichas de pacientes muestran una radiografía sintética y modelos rotables de hueso/fractura, esquemas de osteoporosis y neumonía, célula y dispositivo biomédico. No son estudios reales ni diagnósticos.
- En **Pacientes**, busca por nombre, código, ciudad o especialidad. Las fichas son de solo lectura.
- En **Agenda**, consulta citas, consultorios y quirófanos ficticios.
- En **Mi cuidado**, reserva una cita ficticia, consulta el perfil firmado y abre el modelo anatómico.
- En **Ayuda segura**, prueba el simulador visual de llamada. No llama a un teléfono real.

## Seguridad de la demo

Todos los nombres, identificadores, antecedentes, alergias, disponibilidad, medicamentos, equipos, citas, firmas y existencias son inventados. No introduzcas información de personas reales. La aplicación no ofrece diagnósticos, triage, tratamientos ni dosis. Para una urgencia, indica acudir al centro hospitalario más cercano o contactar los servicios de emergencia locales. El número **+57 000 000 0000** es deliberadamente inválido y aparece solo en la simulación.

Esta demo no es una historia clínica electrónica, no está conectada a una EPS/IPS, no genera prescripciones, no reserva recursos reales, no almacena audio, no valida firmas digitales ni hace diagnóstico o triage. La búsqueda del mapa depende de las APIs y la clave de Google; ubicación y voz dependen de los permisos del navegador. En Medellín se muestra 123 como línea de emergencias. Antes de producción hacen falta autenticación y autorización, auditoría, backend clínico, controles de privacidad y seguridad, interoperabilidad y validación institucional.

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
