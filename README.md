# PrivateFacArtes

Este repositorio contiene una aplicación en NodeJS y ExpressJS que servirá como capa de negocio y capa de datos para la aplicación en React 360 del museo virtual.

- Clonar o descargar este repositorio y ejecutar `npm install` para instalar las dependencias.
- Inicialize las variables de entorno descritas en el archivo `.env`, según corresponda en su entorno.
1. Para Windows: `$env:VARIABLE='valor'`
2. Para Linux: `export VARIABLE=valor`
- Ejecutar `npm start` para iniciar el servidor.

Además este repositorio contiene los archivos de configuración (como scripts SQL, API Keys, variables de entorno, etc.) para el Museo Virtual.

- Consideraciones:
1. Por el momento los errores de servidor se muestran en las páginas de error del cliente debido a que la variable de entorno `NODE_ENV` está en modo `development` por defecto. Establecer NODE_ENV a modo `production` para desplegar la aplicación y no mostrar errores del servidor en el lado del cliente. 
2. Se utiliza el logger `morgan` para visualizar los estados de peticiones HTTP por consola. En modo `development` se hacen logs de tipo `dev` para todas las peticiones, mientras que en modo `production` los logs son de tipo `combined` para las peticiones con códigos de error mayor a 400 únicamente. Es necesario establecer si se requieren almacenar ciertos logs en producción para configurar `morgan` para esta tarea o guardar la salida estándar de esta app mediante alguna utilidad UNIX / LINUX al correr la app.
3. Se utiliza el logger `debug` para motivos de depuración por consola en desarollo. Para poder visualizar los logs de `debug` se debe incializar la variable de entorno `DEBUG` a `backendmuseovirtual:*` o a `backendmuseovirtual:*,memorystore` en caso de que se requieran logs con datos de sesiones. Definir `DEBUG` como una cadena vacía para no mostrar nada. Establecer según se requiera para un entorno en producción. Es necesario establecer si se requieren almacenar ciertos logs en producción, para ello sería bueno utilizar algún otro logger como `winston` o guardar la salida estándar de esta app mediante alguna utilidad UNIX / LINUX al correr la app.