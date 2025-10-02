import express from 'express';
import path from 'path';
import { setImagesRoutes } from './api/routes/imageRoutes.js';
import { fileURLToPath } from 'url';
import upload from './multerConfig.js';
import fs from 'fs';
import { corsMiddleware } from './config/corsConfig.js';
import process from 'process';


// Esta es la forma correcta de definir __dirname en Módulos 
// ES (ESM) en Node.js

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio actual
const __dirname = path.dirname(__filename);

const app = express(); // Crea una instancia de Express
const port = process.env.PORT || 3001; // Usa el puerto definido en las variables de entorno o el 3001 por defecto

// Paso 1: Configurar CORS

// Usamos el middleware de CORS configurado
app.use(corsMiddleware);

// ➡️ La ruta es segura y funciona con tu configuración
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

// ➡️ Paso 2: Leer el archivo JSON al iniciar el servidor
const imageDatos = JSON.parse(fs.readFileSync(path.join(__dirname, 'api', 'data', 'imageDatos.json'), 'utf-8'));


console.log('Sirviendo archivos estáticos desde:', path.join(__dirname, 'assets'));

app.get('/', (req, res) => {
    res.send('¡Servidor de la API funcionando!');
});

// ➡️ Paso 3: Pasar imageDatos a las rutas
app.use('/api', setImagesRoutes(imageDatos, upload));

app.listen(port, () => {
    const serverUrlPrefix = process.env.PORT ? "" : 'http://localhost:'; // Ajuste para entorno local
    console.log(`Servidor de la API escuchando en ${serverUrlPrefix}${port}`); // Mensaje ajustado
});