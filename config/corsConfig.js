// api/config/corsConfig.js
import cors from 'cors';

// Obtener la variable de entorno. Render ya tiene el valor de Vercel aquí.
const CLIENT_URL = process.env.CLIENT_URL;

// Definimos los orígenes permitidos. Usaremos la variable de entorno para producción.
// Y añadiremos los puertos locales explícitamente para el desarrollo local.
const allowedOrigins = [
    // El valor de Vercel de Render (CLIENT_URL)
    CLIENT_URL,
    // Puertos locales de desarrollo (necesarios para probar si corres tu API localmente)
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean); // Filtramos cualquier valor "undefined" o vacío

const corsOptions = {
    origin: (origin, callback) => {
        // 1. Permitir peticiones sin origen (ej: Postman, o la verificación de Render)
        if (!origin) {
            return callback(null, true);
        }

        // 2. Permitir peticiones desde cualquiera de nuestros orígenes permitidos.
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // 3. Bloquear cualquier otro origen (incluyendo la URL interna de Render que está causando el error)
        console.error('CORS: Origen no permitido:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

export const corsMiddleware = cors(corsOptions);