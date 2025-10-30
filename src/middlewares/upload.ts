import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Request } from "express";

// Resolve __dirname in ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists before upload
const ensureDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destPath: string;

    console.log("File fieldname:", file.fieldname);

    if (file.fieldname === "photo") {
      destPath = path.join(__dirname, "../uploads");
    } else if (
      /^document\[\d+\]\[files\]\[\d+\]\[selectedfile\]$/.test(file.fieldname)
    ) {
      console.log("Matched file upload field");
      destPath = path.join(__dirname, "../uploads/documents");
    } else {
      destPath = path.join(__dirname, "../uploads/others");
    }

    ensureDirExists(destPath);
    cb(null, destPath);
  },

  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueName);
  },
});

// Optional file filter (uncomment to activate)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|mkv|avi/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images, videos, and PDF files are allowed"));
  }
};

// Multer instance
const upload = multer({
  storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  // fileFilter,
});

export default upload;
// import multer from 'multer';
// import path from 'path';

// // Configure storage engine for multer
// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, 'uploads/'); // folder to save files (make sure it exists)
//   },
//   filename: function (_req, file, cb) {
//     // Append timestamp + original extension
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   }
// });

// // File filter (optional) - accept only HTML or ZIP or JSON etc.
// const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   const allowedTypes = ['.html', '.zip', '.json'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// export default upload;
