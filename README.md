# Practica del módulo de backend node.js de KeepCoding

### Contents
- [Introduction](#introduction)
- [Instalación y ejecución](#introduction)
  - [Descarga](#rate-limit)
  - [Instalación](#graphql)
  - [Ejecución](#rest)
- [REST API](#REST)
  - [Anuncios](#Anuncios)
  - [Anuncios Schema](#Anuncios-schema)
  - [Obtener todos los anuncios](#Obtener-todos-los-anuncios)
  - [Obtener un único anuncio](#Obtener-un-único-anuncio)
  - [Filtrado de anuncios](#Filtrado-de-anuncios)
  - [Crear un anuncio](#Crear-un-anuncio)
  - [Actualizar un anuncio](#Actualizar-un-anuncio)
- [Web](#location)
  - [Ejemplo de vista de anuncios](#location-schema)

## Introduction

Este proyecto proporciona una API sobre una base de datos sencilla de compra/venta de artículos de segunda mano.

Adicionalmente a la API, se proporciona a modo de ejemplo un par de vistas sobre los datos de la base de datos, para
obtener el listado completo de anuncios en compra/venta, así como el detalle de un anunció concreto.

En este documento se detalla el modo de utilización tanto de la API como de la WEB creada.


## Instrucciones de uso:

### REST

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
- Todos los anuncios con `precio` entre 1 y 100: http://localhost:3001/apiv1/anuncios?precio=1-100
- Las dos consultas anteriores combinadas: http://localhost:3001/apiv1/anuncios?tag=lifestyle&precio=1-100
- Precio entre 1 y 100 de anuncios que empiecen por 'Com': http://localhost:3001/apiv1/anuncios?precio=1-100&name=Com
- Sólo los anuncios de venta: http://localhost:3001/apiv1/anuncios?venta=true
- Sólo los anuncios de compra: http://localhost:3001/apiv1/anuncios?venta=false


Los parámetros disponibles para filtrado son:
- `name`: filtrado por los que empiecen con el string indicado (la API NO es case sensitive).
- `precio`: filtrar por precio. Entre un rango x-y, menores a un precio x-,  o mayores a un precio -y.
- `tag`: permite filtrar los anuncios que tengan el tag indicado. Dentro de los posibles (`work`, `lifestyle`, `motor`, `mobile`).
- `venta`: permite filtrar por anuncios de venta (=true), o anuncios de compra (=false)
- `skip`: permite saltar resultados (utilizado para paginar junto con limit)
- `limit`: permite limitar el número de resultados devueltos
- `fields`: campos a mostrar del anuncio

*Ejemplo de consulta*
```
http://localhost:3001/apiv1/anuncios?precio=1-100&venta=false
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