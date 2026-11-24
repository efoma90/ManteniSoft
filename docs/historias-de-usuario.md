# Historias de usuario – ManteniSoft

## HU-01. Registrar una solicitud
**Como** usuario, **quiero** registrar una solicitud de mantenimiento, **para** documentar un problema o una mejora del software.

**Criterios de aceptación**
- El formulario solicita título, descripción, tipo y prioridad.
- No permite guardar título o descripción vacíos.
- Al registrar, la solicitud aparece en el listado con estado inicial Pendiente.

## HU-02. Consultar solicitudes
**Como** usuario, **quiero** consultar las solicitudes registradas, **para** conocer los trabajos reportados.

**Criterios de aceptación**
- Se muestran las solicitudes registradas.
- Cada solicitud presenta título, descripción, tipo, prioridad y fecha.
- Si no existen solicitudes, se muestra un mensaje informativo.

## HU-03. Cambiar el estado
**Como** usuario, **quiero** cambiar el estado de una solicitud, **para** hacer seguimiento a su atención.

**Criterios de aceptación**
- Se puede seleccionar Pendiente, En proceso o Finalizada.
- El cambio se refleja en el resumen de estados.
- El nuevo estado se conserva al actualizar la página.
- Se informa el resultado del cambio mediante un mensaje accesible.
- Un estado no permitido no modifica la solicitud.
- Si el cambio excluye una solicitud del filtro actual, el foco vuelve al filtro.

**Aporte de mantenimiento:** Nicolás Chesini Martin (`chesco-art`), con asistencia de IA. Se corrigió el cierre de `renderRequests()`, se restituyó la actualización de contadores y se agregó validación y confirmación del cambio de estado. También se corrigió la inversión del orden de HU-02: el registro más reciente aparece primero.

## HU-04. Eliminar una solicitud
**Como** usuario, **quiero** eliminar una solicitud, **para** retirar registros que ya no sean necesarios.

**Criterios de aceptación**
- Cada solicitud tiene una opción para eliminar.
- Antes de eliminar, se solicita confirmación.
- Si se cancela la confirmación, el registro permanece.
- Al confirmar, se actualizan el listado y los contadores.
- Se informa si la eliminación se completó o se canceló.

**Aporte de mantenimiento:** Nicolás Chesini Martin (`chesco-art`), con asistencia de IA. Se mejoró la confirmación, se añadieron mensajes de resultado y se verificó la conservación de registros al cancelar.

## HU-05. Conservar la información
**Como** usuario, **quiero** que las solicitudes permanezcan guardadas al cerrar o actualizar la página, **para** no perder la información registrada.

**Criterios de aceptación**
- Los registros se guardan en LocalStorage.
- Al recargar la página, se recuperan los registros.
- Los cambios de estado y eliminaciones también se guardan.

## Alcance y limitación

La información se almacena localmente en el navegador. Por tanto, no se comparte automáticamente entre los computadores de los integrantes ni entre diferentes navegadores.
