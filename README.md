# PrivateFacArtes

Este repositorio contiene una aplicación en NodeJS y ExpressJS que servirá como capa de negocio y capa de datos para la aplicación en React 360 del museo virtual.

Además este repositorio contiene los archivos de configuración (como scripts SQL, API Keys, variables de entorno, etc.) para el Museo Virtual.

1. Versiones Recomendadas

- NodeJS v12.18.3. 
- NPM 6.14.6.
- MySQL 10.5.5-MariaDB for Linux (x86_64)

2. Pasos para Ejecutar

- Clonar o descargar este repositorio y ejecutar `npm install` para instalar las dependencias.
- Establezca las variables de entorno en el archivo `.env` según las características de su entorno. 
- Ejecutar `npm start` para iniciar el servidor.

3. Consideraciones

- Por el momento los errores de servidor se muestran en las páginas de error del cliente debido a que la variable de entorno `NODE_ENV` está en modo `development` por defecto. Establecer `NODE_ENV` a modo `production` para desplegar la aplicación y no mostrar errores del servidor en el lado del cliente. 
- Se utiliza el logger `morgan` para visualizar los estados de peticiones HTTP por consola. En modo `development` se hacen logs de tipo `dev` para todas las peticiones en la consola, mientras que en modo `production` los logs son de tipo `combined` para las peticiones con códigos de error mayor a 400 únicamente y se guardan en archivos de tipo `logs/http-morgan/http-errors.log`, estos archivos se rotan diariamente, con un máximo de 9 archivos.
- Se utiliza el logger `debug` para motivos de depuración por consola en desarollo. Para poder visualizar los logs de `debug` se debe incializar la variable de entorno `DEBUG` a `backendmuseovirtual:*` o a `backendmuseovirtual:*,memorystore` en caso de que se requieran logs con datos de sesiones. Definir `DEBUG` como una cadena vacía para no mostrar nada (para producción).
- Se utiliza el logger `winston` para mostrar logs de errores de la app. Para `NODE_ENV` en modo `development` los logs se muestran en consola. Para `NODE_ENV` en modo `production` los logs se guardan en archivos de tipo `logs/app-winston/app-errors.log`, estos archivos se rotan diariamente, con un máximo de 9 archivos.

4. Autores

- Berenice Guerrero
- Víctor Herrera
- Pablo Solano

Estudiantes de Ingeniería en Sistemas de la Facultad de Ingeniería de la Universidad de Cuenca.