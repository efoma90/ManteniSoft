# ManteniSoft

Aplicación web sencilla para registrar y hacer seguimiento a solicitudes de mantenimiento de software.

## Objetivo

Practicar el uso colaborativo de Git y GitHub mediante historias de usuario, ramas, commits y solicitudes de integración.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- LocalStorage del navegador

## Cómo ejecutar el proyecto

1. Descarga o clona el repositorio.
2. Abre la carpeta del proyecto.
3. Abre `index.html` en un navegador actualizado.

No requiere instalación de dependencias ni servidor.

## Funcionalidades

- Registrar solicitudes de mantenimiento.
- Consultar solicitudes.
- Cambiar el estado de una solicitud.
- Eliminar solicitudes con confirmación.
- Conservar los datos en el navegador mediante LocalStorage.
- Filtrar solicitudes por estado.

## Historias de usuario

Las historias y sus criterios de aceptación se encuentran en `docs/historias-de-usuario.md`.

## Estructura

```text
ManteniSoft/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── docs/
│   └── historias-de-usuario.md
├── .gitignore
└── README.md
```

## Trabajo colaborativo

Se recomienda trabajar con ramas por funcionalidad y realizar Pull Requests hacia `develop`. Una vez revisados y probados los cambios, se integran a `main`.

## Nota

Los datos se guardan en el navegador donde se utiliza la aplicación. No existe sincronización entre equipos ni usuarios porque el proyecto no utiliza un servidor o base de datos compartida.
