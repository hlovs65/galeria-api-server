// src/config/corsConfig.js
import cors from 'cors';

// Define los orígenes (dominios) que permites acceder a tu API.
// Esto es CRUCIAL para la seguridad y el despliegue.
const allowedOrigins = [
    // 1. Dominio de tu Frontend en la Nube (¡REEMPLAZA ESTO CON LA URL REAL DE VERCEL/NETLIFY!)
    'https://mi-galeria-app.vercel.app', 
    // 2. Dominio de tu Frontend local (para desarrollo)
    'http://localhost:5173', // Usa el puerto que usa tu proyecto React (ej: 3000 o 5173 con Vite)
    'http://localhost:3000'
];

const corsOptions = {
    // La función verifica si el dominio de origen está en la lista permitida
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (ej: Postman, o peticiones locales del mismo dominio)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Rechazar peticiones de dominios no autorizados
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite los métodos que usas en tu API
    credentials: true // Permite el envío de cookies o headers de autorización (si los usaras)
};

// Exportamos el middleware de CORS ya configurado
export const corsMiddleware = cors(corsOptions);