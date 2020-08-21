# PrivateFacArtes

Este repositorio contiene una aplicación en NodeJS y ExpressJS que servirá como capa de negocio y capa de datos para la aplicación en React 360 del museo virtual.

- Clonar o descargar este repositorio y ejecutar `npm install` para instalar las dependencias.
- Inicialize las variables de entorno descritas en el archivo `.env`, según corresponda en su entorno.
1. Para Windows: `$env:VARIABLE='valor'`
2. Para Linux: `export VARIABLE=valor`
- Ejecutar `npm start` para iniciar el servidor.

Además este repositorio contiene los archivos de configuración (como scripts SQL, API Keys, variables de entorno, etc.) para el Museo Virtual.

- Consideraciones:
1. Por el momento los errores de servidor se muestran en las páginas de error del cliente debido a que la variable de entorno `NODE_ENV` está en modo `development` por defecto. Establecer NODE_ENV a modo `production` para desplegar la aplicación. 
2. Se utiliza el logger `morgan` para visualizar los estados de peticiones HTTP por consola. Es necesario establecer si se requieren almacenar ciertos logs en producción para configurar `morgan` para esta tarea.
3. Se utiliza el logger `debug` para motivos de depuración por consola en desarollo. Para poder visualizar los logs de `debug` se debe incializar la variable de entorno `DEBUG` a `backendmuseovirtual:*`. Es necesario establecer si se requieren almacenar ciertos logs en producción, para ello sería bueno utilizar algún otro logger como `winston`.