// api/config/corsConfig.js
import cors from 'cors';

// CRÍTICO: Leer la variable de entorno CLIENT_URL que definimos en Render.
// Esta variable debe contener la URL de Vercel (https://galeria-app-frontend.vercel.app).
// Si no existe (ej: en desarrollo local), usamos localhost:3001 como respaldo.
const CLIENT_URL = process.env.CLIENT_URL; // Render inyecta la URL de Vercel aquí

// 1. Definimos los orígenes permitidos.
// En producción (Render), el valor de CLIENT_URL será la URL de Vercel.
// En desarrollo (Local), podemos añadir todos los puertos que usamos localmente.

let allowedOrigins = [];

if (CLIENT_URL) {
    // Si la variable de Render existe, solo permitimos esa URL.
    allowedOrigins.push(CLIENT_URL);
} else {
    // Si estamos en desarrollo local, permitimos los puertos de desarrollo.
    allowedOrigins = [
        'http://localhost:5173', // Puerto común de Vite/React
        'http://localhost:3000', // Puerto común de React
        'http://localhost:3001'  // Puerto de tu propio Backend (aunque no estrictamente necesario para CORS, es buena práctica)
    ];
}

const corsOptions = {
    // La función verifica si el dominio de origen (el que hace la petición)
    // está incluido en nuestra lista 'allowedOrigins'.
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (ej: Postman, o peticiones locales directas)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Rechazar peticiones de dominios no autorizados
            console.error('CORS: Origen no permitido:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite los métodos que usas en tu API
    credentials: true // Permite el envío de cookies o headers de autorización
};

// Exportamos el middleware de CORS ya configurado
export const corsMiddleware = cors(corsOptions);