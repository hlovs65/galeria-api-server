// multerConfig.js
// Gestiona la subida de archivos utilizando multer con almacenamiento en memoria.
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default upload;