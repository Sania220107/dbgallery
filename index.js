const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("@babel/register")({
  extensions: [".js", ".jsx"],
});
const sequelize = require("./src/config/databaseConfig");
const userRouter = require("./src/controller/userController");
const authRouter = require("./src/controller/authController");
const albumRouter = require("./src/controller/AlbumController");
const fotoRouter = require("./src/controller/fotoController");
const komentarRouter = require("./src/controller/komentarController");
const likeRouter = require("./src/controller/likeController");
require("./src/common/utils/cronjob");

// Untuk aplikasi Express
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Request dari origin:", req.headers.origin);
  next();
})

// Middleware
app.use(
  cors({
    origin: "https://sania220107.github.io", // Asal domain yang diizinkan
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode HTTP yang diizinkan
    allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
    credentials: true, // Jika kamu ingin mengirim cookie/authorization header
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/album", albumRouter);
app.use("/foto", fotoRouter);
app.use("/komentar", komentarRouter);
app.use("/like", likeRouter);

//url gambar
app.use("/uploads", express.static("uploads"));

// Mengatur sinkronisasi database
const syncDb = process.env.DB_SYNC === "true"; // Mengambil nilai dari environment

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false }) // Menggunakan force: false untuk tidak menghapus data saat sinkronisasi
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
      if (syncDb) {
        console.log("Database telah disinkronisasi.");
      } else {
        console.log("Sinkronisasi database dinonaktifkan.");
      }
    });
  })
  .catch((err) => {
    console.error("Gagal menyinkronkan database:", err);
  });
