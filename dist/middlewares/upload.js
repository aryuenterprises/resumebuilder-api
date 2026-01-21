import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
// Setup dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ensure directory exists
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
// Allowed file types
const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|mkv|avi/;
// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destPath;
        if (file.fieldname === "photo") {
            destPath = path.join(__dirname, "../uploads/photos");
        }
        else if (file.fieldname === "resume") {
            destPath = path.join(__dirname, "../uploads/resumes");
        }
        else if (/^document\[\d+\]\[files\]\[\d+\]\[selectedfile\]$/.test(file.fieldname)) {
            destPath = path.join(__dirname, "../uploads/documents");
        }
        else {
            destPath = path.join(__dirname, "../uploads/others");
        }
        ensureDirExists(destPath);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, uniqueName);
    },
});
// Multer middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images, videos, and PDF files are allowed"));
        }
    },
});
export default upload;
