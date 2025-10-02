// api/routes/imageRoutes.js
import express from 'express';
import { createImage } from '../controllers/imageController.js';
import { updateImage, deleteImage, downloadImages } from '../controllers/imageController.js';
import { getImages, getImageById } from '../controllers/imageController.js';

// Define las rutas para obtener imágenes y llama a los controladores correspondientes
// Pasamos arreglo de imágenes como argumento a los controladores
export const setImagesRoutes = (images, upload) => {
    const router = express.Router(); // Crea un nuevo router

    // Ruta para descargar todas las imágenes como un archivo ZIP
    router.post('/download/images', (req, res) => {
        downloadImages(req, res, images);
    });

    // Ruta para subir una imagen
    router.post('/images', upload.single('image'), (req, res) => {
        createImage(req, res, images);
    });

    // Ruta para actualizar una imagen existente
    router.put('/images/:id', (req, res) =>
        updateImage(req, res, images));

    // Ruta para eliminar una imagen
    router.delete('/images/:id', (req, res) =>
        deleteImage(req, res, images));

    router.get('/images', (req, res) => 
        getImages(req, res, images));
    
    router.get('/images/:id', (req, res) => 
        getImageById(req, res, images));
    
    return router;
};
