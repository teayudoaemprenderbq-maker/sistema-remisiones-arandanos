# 🚀 Guía de Despliegue - Sistema de Remisiones de Arándanos de Vida

Este proyecto despliega una aplicación web modular en la nube acoplada al ecosistema corporativo de Google Workspace utilizando Google Apps Script como backend serverless y una interfaz reactiva ligera en HTML5/Tailwind CSS para la gestión comercial.

## 📋 Prerrequisitos de la Base de Datos (Google Sheets)
El script interactúa directamente con el documento centralizado con ID `1O4LqLbH2LbFLmVRgMQ1kbQYR4uVjrZ84zvq9kS61QCo`. Asegúrese de que el archivo cuente exactamente con la estructura de pestañas y tipografía descrita a continuación antes del encendido del frontend:

1. **Pestaña `CLIENTES`**:
   * Columnas en fila 1 (Minúsculas): `id`, `nombre`, `nit`, `dirección`, `teléfono`, `correo`, `ciudad`
2. **Pestaña `PRODUCTOS`**:
   * Columnas en fila 1 (Minúsculas): `id`, `nombre`, `descripción`, `precio_unitario`, `unidad`
3. **Pestaña `CONSECUTIVO`**:
   * Celda `A1`: Debe contener un número entero entero base (por ejemplo, `1`), que actuará como el pivote incremental del sistema.

*Nota: La pestaña `REMISIONES` no requiere creación manual; la lógica del backend la creará e inicializará con sus cabeceras correspondientes de manera autónoma en el primer guardado si detecta su ausencia.*

## 🔧 Pasos para la Instalación y Configuración en Google Cloud

1. Ingrese a [Google Drive](https://drive.google.com) utilizando las credenciales corporativas asociadas al control de la base de Datos.
2. Abra la hoja de cálculo con el ID especificado.
3. En el menú superior, diríjase a **Extensiones** > **Apps Script**. Esto inicializará el entorno IDE del script en la nube de Google.
4. Proceda a borrar cualquier código autogenerado por defecto en el panel de edición.
5. Cree un archivo de tipo Script llamado `Code.gs` y copie de manera íntegra el bloque de código provisto en esta especificación.
6. Cree un archivo de tipo HTML llamado `index.html` (asegúrese de no incluir la extensión `.html` de manera explícita en el nombre del formulario del IDE ya que Google la añade de forma transparente) y pegue el código del frontend provisto.
7. Sustituya el archivo de configuración oculta `appsscript.json` (Si no es visible en su IDE de desarrollo, active la visibilidad haciendo clic en el ícono de engranaje de configuración a la izquierda y marcando *"Mostrar archivo de manifiesto appsscript.json en el editor"*).

## 🌐 Publicación de la Aplicación Web

Para generar el enlace de producción que operará el personal encargado de despachos, realice los siguientes clics de compilación:

1. En la esquina superior derecha del panel de Apps Script, haga clic en el botón **Implementar** (Deploy) > **Nueva implementación**.
2. Seleccione el ícono de engranaje junto a "Seleccionar tipo" y elija la opción **Aplicación web**.
3. Configure los siguientes parámetros de seguridad de forma estricta:
   * **Descripción:** Versión 1.0.0 - Lanzamiento Producción Remisiones.
   * **Ejecutar como (Execute as):** `Yo (tu_cuenta@gmail.com)` *(Esto permite que el frontend acceda a la base de datos bajo los alcances autorizados del administrador del archivo).*
   * **Quién tiene acceso (Who has access):** `Cualquier persona (Anyone)` *(Indispensable para que los operadores puedan cargar el formulario web desde navegadores locales sin bloqueos de login corporativo).*
4. Haga clic en **Implementar**. El sistema le solicitará otorgar permisos explícitos de lectura y escritura sobre el Google Sheet corporativo. Conceda los accesos de confianza.
5. Copie la **URL de la aplicación web** generada (Enlace con terminación `/exec`). Esta es la dirección definitiva que el equipo usará para emitir las remisiones.

## 🧪 Validaciones del Ciclo de Flujo de Datos
* **Carga Inicial:** Al cargar la URL `/exec`, el sistema consultará el consecutivo vivo actual en la celda `A1` de la pestaña `CONSECUTIVO` (Ejemplo: `REM-0001`).
* **Autocompletado CORS:** Al escribir el nombre de un cliente o producto, la caja contextual nativa autocompletará en milisegundos las referencias cruzadas extrayendo los datos de precios e información fiscal de contacto.
* **Descarga Inmediata:** Al presionar "Generar", el backend insertará los datos transaccionales en la hoja histórica, bloqueará el botón para evitar doble inserción errónea y llamará nativamente a `html2pdf.js`, el cual compilará el HTML del recibo estructurado y descargará el archivo PDF limpio en tamaño Carta de forma automática en la carpeta local de descargas del usuario.
* **Nueva Iteración Comercial:** Al presionar "Nueva Remisión", el sistema consultará e incrementará el contador en el Sheet, limpiará el formulario y dejará las variables de entorno listas para la siguiente transacción.
