const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Folder tempat menyimpan file
  },
  filename: (req, file, cb) => {
    const originalName = req.body.JudulFoto || "file"; // Gunakan fallback jika `JudulFoto` kosong
    const sanitizedOriginName = originalName.replace(/[^a-zA-Z0-9]/g, "_");
    cb(
      null,
      sanitizedOriginName + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Inisialisasi multer
const upload = multer({ storage });

module.exports = upload;