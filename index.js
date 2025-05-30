const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("@babel/register") ({
  extensions: [".js", ".jsx"],
})
const sequelize = require("./src/config/databaseConfig");
const userRouter = require("./src/controller/userController");
const authRouter = require("./src/controller/authController");
const albumRouter = require("./src/controller/AlbumController")
const fotoRouter = require("./src/controller/fotoController")
const komentarRouter = require("./src/controller/komentarController")
const likeRouter = require("./src/controller/likeController")
require("./src/common/utils/cronjob")

// Untuk aplikasi Express
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(bodyParser.json());

// Rute
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/album", albumRouter);
app.use("/foto", fotoRouter);
app.use("/komentar", komentarRouter);
app.use("/like", likeRouter)

//url gambar
app.use("/uploads", express.static("uploads"));

// Mengatur sinkronisasi database
const syncDb = process.env.DB_SYNC === "true"; // Mengambil nilai dari environment

sequelize
  .sync({ force: false }) // Menggunakan force: false untuk tidak menghapus data saat sinkronisasi
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server berjalan pada port ${process.env.PORT}`);
      if (syncDb) {
        console.log("Database telah disinkronisasi.");
      } else {
        console.log("Sinkronisasi database dinonaktifkan.");
      }
    });
  })
  .catch((err) => {
    console.error("Gagal menyinkronkan database:", err);
  });