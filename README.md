### Inherity

Cuando desarrollas proyectos grandes usando preprocesadores como pug, stylus, sass, etc. el proceso de compilacion de estos se vuelve lento por la cantidad de archivos que intervienen y mas si manejas watcheros. Por eso nace inherity, ayudando al rendimiento de tu proyecto, puedes configurarlo como gustes para trabajar con cualquier preprocesador, y listo.

### What do

Inherity analiza el stream en busca de dependencias recursivamente.

### Use

Inherity te dara todas las dependencias de tus archivos, por ejemplo:

// folders
- pug
  - _includes    
      |-- config.pug
  - views
      |-- index.pug
// index.pug
include /_includes/page.pug
Inherity para el archivo /views/index.pug , devolvera todas sus dependencias en un array.

### Dependencies

// server.js
let inherity = new inherity({
  basedir: "pug",
  extension : "*.pug",
  ...
})

console.log(inherity.dependencies);

// resultado del console.log
["/pug/_includes/page.pug"]

### Methods

dependencies: devuelve todas las dependencias del archivo a procesar.

### Support

From Node JS < 0.12.0