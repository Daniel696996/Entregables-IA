# MedNexus OS

Demo de plataforma hospitalaria bilingüe con vistas para equipo clínico y pacientes, agenda, inventario, directorio, historial de solo lectura, atención segura y visualizaciones 3D sintéticas.

## Inicio rápido

Requisitos: Node.js 20.9 o posterior y npm.

    cd MedNexus-OS
    npm install
    npm run dev

Abre http://localhost:3000. Para generar una compilación de producción:

    npm run build
    npm start

La primera instalación descarga las dependencias de npm. El visor 3D genera su geometría en el navegador; no descarga modelos médicos. Las fotos de perfil son retratos de demostración hospedados en Unsplash; las pantallas usan datos ficticios locales.

## Navegación

- Cambia entre **Clínico** y **Paciente** desde la barra lateral.
- Cambia el idioma con el botón **ES / EN**.
- En **Inventario**, combina categoría, vía/especificación, texto y existencia crítica. Desde el espacio clínico, abre un producto para rotarlo y acercarlo.
- En **Equipo médico**, combina especialidad, turno y estado; abre una ficha de demostración.
- En **Pacientes**, busca por nombre, código, ciudad o especialidad. Las fichas son de solo lectura.
- En **Agenda**, consulta citas, consultorios y quirófanos ficticios.
- En **Mi cuidado**, reserva una cita ficticia, consulta el perfil firmado y abre el modelo anatómico.
- En **Ayuda segura**, prueba el simulador visual de llamada. No llama a un teléfono real.

## Seguridad de la demo

Todos los nombres, identificadores, antecedentes, alergias, disponibilidad, medicamentos, equipos, citas, firmas y existencias son inventados. No introduzcas información de personas reales. La aplicación no ofrece diagnósticos, triage, tratamientos ni dosis. Para una urgencia, indica acudir al centro hospitalario más cercano o contactar los servicios de emergencia locales. El número **+57 000 000 0000** es deliberadamente inválido y aparece solo en la simulación.

Esta demo no es una historia clínica electrónica, no está conectada a una EPS/IPS, no genera prescripciones, no reserva recursos reales, no solicita la ubicación y no certifica firmas digitales. Antes de producción hacen falta autenticación y autorización, auditoría, backend clínico, controles de privacidad y seguridad, interoperabilidad y validación institucional.

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
