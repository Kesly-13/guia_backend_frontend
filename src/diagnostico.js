require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

console.log('🔍 Iniciando diagnóstico del servidor...');

// Comprobar variables de entorno
console.log('\n📋 Verificando variables de entorno:');
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
let envMissing = false;

requiredEnvVars.forEach(variable => {
  if (!process.env[variable]) {
    console.log(`❌ Variable ${variable} no encontrada`);
    envMissing = true;
  } else {
    console.log(`✅ Variable ${variable} configurada`);
  }
});

if (envMissing) {
  console.log('\n⚠️ Algunas variables de entorno están faltando. Crea un archivo .env en la raíz del proyecto.');
} else {
  console.log('\n✅ Todas las variables de entorno requeridas están configuradas.');
}

// Comprobar estructura de carpetas y archivos críticos
console.log('\n📂 Verificando estructura del proyecto:');
const requiredFiles = [
  'server.js',
  'src/app.js',
  'config/db.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ Archivo ${file} encontrado`);
  } else {
    console.log(`❌ Archivo ${file} no encontrado`);
  }
});

// Comprobar conexión a base de datos
console.log('\n🔌 Verificando conexión a base de datos...');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.log('❌ Error al conectar a la base de datos:');
    console.log(err);
  } else {
    console.log('✅ Conexión a la base de datos exitosa');
    connection.end();
  }
  
  console.log('\n📝 Recomendaciones:');
  console.log('1. Asegúrate de tener todas las variables en el archivo .env');
  console.log('2. Ejecuta "npm install" para instalar todas las dependencias');
  console.log('3. Verifica que el servicio MySQL esté activo');
  console.log('4. Comprueba que el puerto configurado no esté en uso');
  console.log('\n🚀 Para iniciar el servidor, ejecuta: npm run dev');
});