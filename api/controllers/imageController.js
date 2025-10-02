// api/controllers/imageController.js

import path from 'path';
import crypto from 'crypto';
import archiver from 'archiver';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Definir __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url); // Ruta completa del archivo actual
const __dirname = path.dirname(__filename);  // Directorio del archivo actual
console.log('Nombre del archivo actual __filename:', __filename);
console.log('Directorio actual __dirname:', __dirname);

// Ruta al archivo JSON de datos
const imageDatosPath = path.join(__dirname, '..', 'data', 'imageDatos.json');

// Nuevo controlador para descargar imágenes comprimidas
export const downloadImages = (req, res, images) => {
    const { imageIds } = req.body;
    console.log('IDs de imágenes recibidos para descargar:', imageIds);
    // Validar que se enviaron IDs
    if (!imageIds || imageIds.length === 0) {
        return res.status(400).json({ message: 'No se recibieron IDs de imágenes para descargar' });
    }

    const archive = archiver('zip', {
        zlib: { level: 9 } // Nivel de compresión
    });

    // Configura la respuesta para el archivo ZIP
    res.attachment('mi-galeria-de-imagenes.zip');
    archive.pipe(res);

    // Agrega los archivos al ZIP
    imageIds.forEach(id => {
        const image = images.find(img => parseInt(img.id) === id);
        if (image) {
            const filePath = path.join(__dirname, '..', '..', 'assets', image.filename);
            archive.file(filePath, { name: image.filename });
        }
    });

    // Finaliza el archivo ZIP
    archive.finalize();

    // Manejo de errores
    archive.on('error', (err) => {
        console.error('Error al comprimir:', err);
        res.status(500).send('Error interno del servidor.');
    });
};

// Controlador para crear una nueva imagen
export const createImage = (req, res, images) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
  }
  // Obtenemos el buffer del archivo y su extensión
  const fileBuffer = req.file.buffer;
  const fileExtension = path.extname(req.file.originalname);
  console.log('Extensión del archivo subido fileExtension:', fileExtension);

  // Generamos un hash único a partir del contenido del archivo
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  const fileHash = hashSum.digest('hex');
  const newFilename = fileHash + fileExtension; // Nombre del archivo con hash y extensión
  const newImageUrl = `/assets/${fileHash}${fileExtension}`; // URL pública de la imagen
  const filePath = path.join(__dirname, '..', '..', 'assets', fileHash + fileExtension);  // Ruta completa en el servidor
  console.log('URL de la nueva imagen newImageUrl:', newImageUrl);
  console.log('Ruta completa del archivo en el servidor filePath:', filePath);


  // Verificamos si el archivo ya existe en el disco
  if (fs.existsSync(filePath)) {
    console.log('El archivo ya existe en el disco.');
    const existingImage = images.find(img => img.imageUrl === newImageUrl);
    if (existingImage) {
      return res.status(200).json(existingImage);
    } else {
      const newImage = {
        id: images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        imageUrl: newImageUrl,
        filename: newFilename
      };

      images.push(newImage);
      // Actualizamos el archivo de datos
      fs.writeFileSync(imageDatosPath, JSON.stringify(images, null, 2), 'utf-8');
      return res.status(200).json(newImage);
    }
  }

  // Si el archivo es nuevo, lo guarda y añade sus datos.
  console.log('El archivo es nuevo. Se guardará en el disco.');
  fs.writeFileSync(filePath, fileBuffer);

  const newImage = {
    id: images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1,
    title: req.body.title,
    description: req.body.description,
    imageUrl: newImageUrl,
    filename: newFilename
  };

  images.push(newImage);
  // Actualizamos el archivo de datos
  fs.writeFileSync(imageDatosPath, JSON.stringify(images, null, 2), 'utf-8');

  res.status(201).json(newImage);
};

// Controlador para obtener todas las imágenes
export const getImages = (req, res, images) => {
  res.json(images);
};

// Controlador para obtener una imagen por ID
export const getImageById = (req, res, images) => {
  const { id } = req.params;
  const image = images.find((img) => img.id === parseInt(id));
  if (image) {
    res.json(image);
  } else {
    res.status(404).json({ message: 'Imagen no encontrada' });
  }
};

// ➡️ Controlador para actualizar una imagen por ID
export const updateImage = (req, res, images) => {
    const id = parseInt(req.params.id);
    const imageIndex = images.findIndex(img => parseInt(img.id) === id);

    if (imageIndex === -1) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const { title, description } = req.body;
    images[imageIndex].title = title || images[imageIndex].title;
    images[imageIndex].description = description || images[imageIndex].description;

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(imageDatosPath, JSON.stringify(images, null, 2), 'utf-8');

    res.status(200).json(images[imageIndex]);
};

// ➡️ Controlador para eliminar una imagen por ID
export const deleteImage = (req, res, images) => {
    const id = parseInt(req.params.id);
    const imageIndex = images.findIndex(img => img.id === id);

    if (imageIndex === -1) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const deletedImage = images.splice(imageIndex, 1)[0];
    const imageFilePath = path.join(__dirname, '..', '..', 'assets', deletedImage.filename);

    // Eliminar el archivo físico de la carpeta 'assets'
    try {
        fs.unlinkSync(imageFilePath);
    } catch (error) {
        console.error("Error al eliminar el archivo:", error);
    }

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(imageDatosPath, JSON.stringify(images, null, 2), 'utf-8');

    res.status(200).json({ message: 'Imagen eliminada con éxito' });
};