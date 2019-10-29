# Practica del módulo de backend node.js de KeepCoding

### Contents
- [Introducción](#INTRODUCCION)
- [Instalación y ejecución](#INSTALACIÓN-Y-EJECUCIÓN)
  - [Descarga](#Descarga)
  - [Instalación](#Inicialización-de-base-de-datos)
  - [Ejecución](#Ejecución)
  - [Configuración](#Configuración)
- [REST API](#REST-API)
  - [Anuncios](#Anuncios)
  - [Anuncios Schema](#Anuncios-schema)
  - [Obtener todos los anuncios](#Obtener-todos-los-anuncios)
  - [Obtener un único anuncio](#Obtener-un-único-anuncio)
  - [Filtrado de anuncios](#Filtrado-de-anuncios)
  - [Listado de tags](#Listado-de-tags)
  - [Crear un anuncio](#Crear-un-anuncio)
  - [Actualizar un anuncio](#Actualizar-un-anuncio)
- [Web](#location)
  - [Ejemplo de vista de anuncios](#location-schema)

### INTRODUCCION

Este proyecto proporciona una API sobre una base de datos sencilla de compra/venta de artículos de segunda mano.

Adicionalmente a la API, se proporciona a modo de ejemplo un par de vistas sobre los datos de la base de datos, para
obtener el listado completo de anuncios en compra/venta, así como el detalle de un anunció concreto.

En este documento se detalla el modo de utilización tanto de la API como de la WEB creada.

### INSTALACIÓN Y EJECUCIÓN

## Descarga

Para descargar este repositorio:
```
\downloads\git clone https://github.com/IsmaelB83/keepcoding-backend-node.git   (o bien con ssh)
\downloads\git clone git@github.com:IsmaelB83/keepcoding-backend-node.git
```

## Instalación de modulos

Utiliza npm install para instalar todas las dependencias de la aplicación
```
\downloads\keepcoding-backend-node\npm install
```

## Inicialización de base de datos

Inicializa la base de datos mongo. Esto borrará la colección "item" de la base de datos mongo (nodepop), y creará los anuncios contenidos en
\downloads\keepcoding-backend-node\src\database\data.json
```
\downloads\keepcoding-backend-node\npm run init
```

## Ejecución

Para arrancar la API y la web utilizaremos npm start. Arrancando de esta forma (sin parámetros), el servidor se arrancará por defecto en modo HTTP escuchando en el puerto 8080.
```
\downloads\keepcoding-backend-node\npm start
```

Para arrancar el servidor en un puerto distinto, y en modo HTTPS debemos indicar dos parametros al script de arranque: HTTPS y PORT. El siguiente comando arranca el server en modo https a la escucha en el puerto 443.
```
\downloads\keepcoding-backend-node\HTTPS=Y PORT=443 npm start
```

## Configuración

En el fichero ubicado en /src/config.js se pueden configurar diversos parámetros de la aplicación como son: puertos por defecto (8080/8443), la url de conexión a mongodb, y las rutas de los certificados en caso
de querer instanciar un server https.
```js
module.exports = {
  ports: [8080, 8443],
  mongodb: "mongodb://localhost:27017/nodepop",
  privateKey: `/etc/letsencrypt/live/autodeluxegarage.es/privkey.pem`,
  certificate: `/etc/letsencrypt/live/autodeluxegarage.es/cert.pem`,
  ca: `/etc/letsencrypt/live/autodeluxegarage.es/chain.pem`,
}
```

### REST API

## Anuncios
Hay un total de 10 anuncios en el script de carga proporcionado.

### Anuncios-schema
|Key|Type|Description|
|---|---|---|
|_id|string|Id del anuncio
|name|string|Nombre del anuncio (30char)
|description|string|Descripción larga del anuncio (100char)
|price|number|Precio de compra/venta
|type|string|Tipo del anuncio. Puede ser 'buy' o 'sell'
|photo|string|Url a la imagen principal del anuncio
|tags|array|Array de tags asociados al anuncio

### Obtener todos los anuncios
Pueds obtener todos los anuncios de la base de datos mediante el endpoint `/anuncios`.
```
http://localhost:3001/apiv1/anuncios
```
```js
{
  "success": true,
  "results": [
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463ab4",
      "name": "PS4Pro",
      "description": "Compro PS4 Pro con menos de 1 año de uso",
      "price": 200.99,
      "type": "buy",
      "photo": "/images/anuncios/ps4pro.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.944Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    // ...
  ]
}
```
### Obtener un único anuncio
Puede obtener un único anuncio añadiendo el `id` a continuación del endpoint: `/anuncios/5d3a0a5f9bd7ed2ece463ab4`
```
http://localhost:3001/apiv1/anuncios/5d3a0a5f9bd7ed2ece463ab4
```
```js
{
  "success": false,
  "result": {
    "tags": [
      "lifestyle"
    ],
    "_id": "5d3a0a5f9bd7ed2ece463ab4",
    "name": "PS4Pro",
    "description": "Compro PS4 Pro con menos de 1 año de uso",
    "price": 200.99,
    "type": "buy",
    "photo": "/images/anuncios/ps4pro.jpg",
    "__v": 0,
    "createdAt": "2019-07-25T20:00:31.944Z",
    "updatedAt": "2019-07-25T20:00:31.945Z"
  }
}
```

### Filtrado de anuncios
Puedes incluir filtros en la URL añadiendo parametros especiales a la consulta. Para comenzar con el filtrado incorpora el carácter `?` seguido de las queries a incorporar
en el siguiente formato `<query>=<value>`. Si necesitas encadenar varias consultas puedes utilizar el carácter `&`.

Ejemplos de consultas:
- Todos los anuncios que contienen el `tag` lifestyle: http://localhost:3001/apiv1/anuncios?tag=lifestyle: 
- Todos los anuncios con `price` entre 1 y 100: http://localhost:3001/apiv1/anuncios?price=1-100
- Las dos consultas anteriores combinadas: http://localhost:3001/apiv1/anuncios?tag=lifestyle&price=1-100
- Precio entre 1 y 100 de anuncios que empiecen por 'Com': http://localhost:3001/apiv1/anuncios?price=1-100&name=Com
- Sólo los anuncios de venta: http://localhost:3001/apiv1/anuncios?venta=true
- Sólo los anuncios de compra: http://localhost:3001/apiv1/anuncios?venta=false


Los parámetros disponibles para filtrado son:
- `name`: filtrado por los que empiecen con el string indicado (la API NO es case sensitive).
- `price`: filtrar por precio. Entre un rango x-y, menores a un precio x-, o mayores a un precio -y.
- `tag`: permite filtrar los anuncios que tengan el tag indicado. Dentro de los posibles (`work`, `lifestyle`, `motor`, `mobile`).
- `venta`: permite filtrar por anuncios de venta (=true), o anuncios de compra (=false)
- `skip`: permite saltar resultados (utilizado para paginar junto con limit)
- `limit`: permite limitar el número de resultados devueltos
- `fields`: campos a mostrar del anuncio

*Ejemplo de consulta*
```
http://localhost:3001/apiv1/anuncios?price=1-100&venta=false
```
```js
{
  "success": true,
  "results": [
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463abc",
      "name": "Comba de Crossfit",
      "price": 8,
      "description": "Soy el de las calleras.",
      "type": "buy",
      "photo": "/images/anuncios/comba.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    {
      "tags": [
        "lifestyle",
        "work",
        "mobile"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463ab7",
      "name": "Teclado Gaming Razer Chroma",
      "price": 70,
      "description": "Busco teclado razer en buen estado.",
      "type": "buy",
      "photo": "/images/anuncios/tecladorazer.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    },
    {
      "tags": [
        "lifestyle"
      ],
      "_id": "5d3a0a5f9bd7ed2ece463abb",
      "name": "Calleras Crossfit",
      "price": 15,
      "description": "Dejate de romperte las manos en los WODs",
      "type": "buy",
      "photo": "/images/anuncios/calleras.jpg",
      "__v": 0,
      "createdAt": "2019-07-25T20:00:31.945Z",
      "updatedAt": "2019-07-25T20:00:31.945Z"
    }
  ]
}
```

### Listado de tags
Puedes obtener un listado de los tags existentes en la base de datos mediante el recurso /tag de la API: http://127.0.0.1:3001/apiv1/tags

*Ejemplo de consulta*
```
http://127.0.0.1:3001/apiv1/tags
```
```js
{
  "success": true,
  "count": 4,
  "results": [
    "lifestyle",
    "mobile",
    "motor",
    "work"
  ]
}
```

### Crear un anuncio
Para crear un anuncio debes llamar a la url base de anuncios con el metodo POST. Pasando en el body del request todos los parametros para definir el nuevo anuncio
```
http://localhost:3001/apiv1/anuncios  (POST)
```

### Actualizar un anuncio
Para actualizar un anuncio se debe llamar a la URL base de un anuncio único `anuncio/id` utilizando el metodo PUT. Además en el body del request se indicarán los nuevos valores
de los parametros que se deseen modificar.
```
http://localhost:3001/apiv1/anuncios/5d3a0a5f9bd7ed2ece463abb  (PUT)
```


### WEB

Adicionalmente a la API se proporciona una web con dos vistas, para poder visualizar el contenido de anuncios de la base de datos. Estas dos vistas son el propio `index`, y la vista de `detail`, 
a la que se navega desde la vista de index cuando se hace click en el detalle de un anuncio cualquiera:

```
http://localhost:3001/                          (index)
http://localhost:3001/5d3a0a5f9bd7ed2ece463abc  (detail del anuncio indicado)
```