const express = require("express")
const router = express.Router()
const FotoRepository = require("../repository/fotoRepository")
const { StatusCodes } = require("http-status-codes")
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse")
const upload = require("../middleware/multerConfig")
const authMiddleware = require("../middleware/authMiddleware")
const Foto = require("../models/foto")
const Album = require("../models/Album")

class FotoController {

      async create(req, res) {
    try {
      const UserID = req.UserID; // Ambil UserID dari middleware auth
      const LokasiFile = req.file ? req.file.filename : null; // Ambil nama file dari multer

      if (!LokasiFile) {
        throw new Error("File tidak ditemukan. Pastikan file diunggah.");
      }

      const { JudulFoto, DeskripsiFoto, AlbumID } = req.body;

      // Periksa apakah AlbumID valid
      const album = await Album.findByPk(AlbumID);
      if (!album) {
        throw new Error("Album tidak ditemukan");
      }

      const foto = await Foto.create({
        JudulFoto,
        DeskripsiFoto,
        LokasiFile,
        TanggalUnggah: new Date(),
        UserID,
        AlbumID
      });

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil menambahkan foto",
            foto
          )
        );
    } catch (error) {
      console.error("Error membuat foto: ", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            error.message
          )
        );
    }
  }

  async getAll(req, res) {
    try {
      const foto = await FotoRepository.getAll();
      res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengambil semua data foto",
            foto
          )
        );
    } catch (error) {
      console.error("Error mengambil semua data foto: ", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat mengambil semua data foto"
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const foto = await FotoRepository.getById(req.params.id);
      res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengambil data foto berdasarkan id",
            foto
          )
        );
    } catch (error) {
      console.log("Error saat mengambil foto berdasarkan id: ", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat mengambil foto"
          )
        );
    }
  }

  async getByUserID(req, res) {
    const UserID = req.UserID;
    if(!UserID) {
      throw new Error("User tidak ditemukan")
    }
    try {
        const foto = await FotoRepository.getByUserID(UserID);
        return res
        .status(StatusCodes.OK)
        .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil foto berdasarkan UserID: ", foto))
    } catch (error) {
        console.log("Error mengambil foto berdasarkan UserID: ", error)
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil foto berdasarkan UserID"))
    }
  }

  async getByAlbum(req, res) {
    const UserID = req.UserID;
    try {
      const AlbumID = req.params.AlbumID;
      if(!AlbumID) {
        throw new Error("AlbumID tidak ditemukan di parameter")
      }
        const foto = await FotoRepository.getByAlbumID( AlbumID, req.body, UserID);
        return res
        .status(StatusCodes.OK)
        .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil foto berdasarkan album: ", foto))
    } catch (error) {
        console.log("Error foto berdasarkan Album: ", error)
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil foto berdasarkan ALbum"))
    }
  }

  async update(req, res) {
  try {
    const foto = await FotoRepository.updateFoto(req.params.id);
    if (!foto) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Foto tidak ditemukan",
      });
    }

    // Periksa jika file baru diunggah atau tidak
    const LokasiFile = req.file ? req.file.filename : foto.LokasiFile;

    // Update hanya data yang berubah
    const updatedFoto = await FotoRepository.updateFoto(
      req.params.id,
      req.body, // Hanya mengirim data selain LokasiFile
      LokasiFile // Tetap menggunakan foto yang lama jika tidak ada file baru
    );

    return res.status(StatusCodes.OK).json(
      defaultBaseResponse(
        StatusCodes.OK,
        true,
        "Berhasil memperbarui data foto",
        updatedFoto
      )
    );
  } catch (error) {
    console.log("Error saat memperbarui foto: ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      defaultBaseResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Terjadi kesalahan saat memperbarui foto"
      )
    );
  }
}


  async delete(req, res) {
    try {
      const foto = await FotoRepository.delete(req.params.id);
      res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus foto",
            foto
          )
        );
    } catch (error) {
      console.log("Error saat menghapus foto: ", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat menghapus foto"
          )
        );
    }
  }
  
  async getCount(req, res) {
    try {
      const UserID = req.UserID;
      const AlbumID= req.params.AlbumID
      const album = await FotoRepository.getCountByAlbumID(UserID, AlbumID)
      return res
      .status(StatusCodes.OK)
      .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil", album))
    } catch (error) {
      console.log("Error: ", error)
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Gagal"))
    }
  }

  async deleteUser(req, res) {
    try {
      const UserID= req.UserID;
      const foto = await FotoRepository.deleteByuser(req.params.id, UserID)
      return res
      .status(StatusCodes.OK)
      .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mneghapus", foto))
    } catch (error) {
      console.log("Error: ", error)
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "terjadi kesalahan"))
    }
  }

  async fotoHapus(req, res) {
    const UserID = req.UserID;
    try {
      const history = await FotoRepository.fotoTerhapus(UserID);
      return res
      .status(StatusCodes.OK)
      .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil", history))
    } catch (error) {
      console.log("Error: ", error)
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Gagal"))
    }
  }

  async restore(req, res) {
    const UserID = req.UserID;
    try {
      const id = req.params.id;
      const restore = await FotoRepository.restore(UserID, id)
      return res
      .status(StatusCodes.OK)
      .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil", restore))
    } catch (error) {
      console.log("Error: ", error)
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Gagal"))
    }
  }
}

const fotoController = new FotoController();

router.post("/", upload.single("LokasiFile"), authMiddleware, fotoController.create.bind(fotoController))
router.get("/count/album/:AlbumID", authMiddleware, fotoController.getCount.bind(fotoController))
router.get("/", fotoController.getAll.bind(fotoController))
router.get("/:id", fotoController.getById.bind(fotoController))
router.get("/users/me", authMiddleware, fotoController.getByUserID.bind(fotoController))
router.get("/album/:AlbumID", authMiddleware, fotoController.getByAlbum.bind(fotoController))
router.put("/:id", upload.single("LokasiFile"), fotoController.update.bind(fotoController))
router.delete("/:id", fotoController.delete.bind(fotoController))
router.delete("/users/:id", authMiddleware, fotoController.deleteUser.bind(fotoController))
router.get("/users/history", authMiddleware, fotoController.fotoHapus.bind(fotoController))
router.put("/users/restore/:id", authMiddleware, fotoController.restore.bind(fotoController))
module.exports = router;