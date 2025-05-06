const multer = require('multer');
// Importa el modulo 'multer', que sirve para manejar la subida de archivos desde formularios en Node.justifyContent:

// Almacenamiento en memoria
const storage = multer.memoryStorage();
// Se define una estrategia de almacenamiento en memoria (RAM) temportal para los archivos subidos. Esto Significa que los archivos no se guardan en el disco, sino en un buffer en memoria.

const upload = multer({ storage });
// Se crea una instancia del middleware de subida con la configuracion de almacenamiento definida (en memoria). Esta instancia puede ser utilizada en las rutas donde acepten archivos, por ejemplo, imagenes de perfil.

module.exports = upload;
// se exporta la configuracion para poder utilizarla en otros archivos del proyecto (como en rutas de express)
