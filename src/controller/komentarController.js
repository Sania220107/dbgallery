const express = require("express")
const router = express.Router();
const { StatusCodes } = require("http-status-codes")
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse")
const KomentarRepository = require("../repository/komentarRepository")
const authMiddleware = require("../middleware/authMiddleware")

class KomentarController {
    async create(req, res) {
        try {
            const UserID = req.UserID;
            console.log("UserID dari token: ", UserID)
            const komentar = await KomentarRepository.create(req.body, UserID)
            console.log("Data yang diterima: ", komentar)
            return res
            .status(StatusCodes.CREATED)
            .json(defaultBaseResponse(StatusCodes.CREATED, true, "Berhasil membuat komentar", komentar))
        } catch (error) {
            console.log("Error membuat komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat membuat komentar"))
        }
    }

    async getAll(req, res) {
        try {
            const komentar = await KomentarRepository.getAll();
            console.log("Data yang diterima: ", komentar)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil semua data komentar: ", komentar))
        } catch (error) {
            console.log("Error mengambil semua data komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil semua komentar"))
        }
    }

    async getById(req, res) {
        try {
            const komentar = await KomentarRepository.getById(req.params.id)
            console.log("Data yang diterima: ", komentar)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil komentar berdasarkan id", komentar))
        } catch (error) {
            console.log("Error mengambil komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data komentar"))
        }
    }

    async getByUserID(req, res) {
        const UserID = req.UserID;
        if(!UserID) {
            throw new Error("User tidak ditemukan")
        }
        try {
            const komentar = await KomentarRepository.getByUserID(UserID)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data komentar berdasarkan UserID", komentar))
        } catch (error) {
            console.log("Error mengambil data komentar berdasarkan UserID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data komentar berdasarkan UserID"))
        }
    }

    async getByFotoID(req, res) {
        const UserID = req.UserID;
        const FotoID = req.params.FotoID;
        try {
            const komentar = await KomentarRepository.getBYFotoID(FotoID, UserID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil komentar berdasarkan FotoID", komentar))
        } catch (error) {
            console.log("Error mengambil data komentar berdasarkan FotoID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data komentar berdasarkan FotoID"))
        }
    }

    async countAll(req, res) {
        try {
            const komentar = await KomentarRepository.CountAll();
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung semua jumlah komentar", komentar))
        } catch (error) {
            console.log("Error menghitung semua komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung semua komentar"))
        }
    }

    async countByFotoID(req, res) {
        try {
            const komentar = await KomentarRepository.countByFotoID(req.params.FotoID)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung jumlah komentar berdasarkan Foto", komentar))
        } catch (error) {
            console.log("Error menghitung jumlah komentar berdasarkan foto: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung komentar berdasarkan foto"))
        }
    }

    async countByUserID(req, res) {
        const UserID = req.UserID;
        try {
            const komentar = await KomentarRepository.countByUserID(UserID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung jumlah komentar berdasarkan userID", komentar))
        } catch (error) {
            console.log("Error menghitung jumlah komentar berdasarkan UserID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung komentar berdasarkan UserID"))
        }
    }

    async update(req, res) {
        try {
            const komentar = await KomentarRepository.update(req.params.id, req.body)
            console.log("Komentar setelah di perbarui: ", komentar)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil memperbarui komentar", komentar))
        } catch (error) {
            console.log("Error memperbarui komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat memperbarui komentar"))
        }
    }

    async delete(req, res) {
        try {
            const komentar = await KomentarRepository.delete(req.params.id)
            console.log("Data yang diterima setelah dihapus: ", komentar)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghapus komentar", komentar))
        } catch (error) {
            console.log("Error menghapus komentar: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghapus komentar"))
        }
    }
}

const komentarController = new KomentarController();

router.post("/", authMiddleware, komentarController.create.bind(komentarController))
router.get("/", komentarController.getAll.bind(komentarController))
router.get("/:id", komentarController.getById.bind(komentarController))
router.get("/users/me", authMiddleware, komentarController.getByUserID.bind(komentarController))
router.get("/foto/:FotoID", komentarController.getByFotoID.bind(komentarController))
router.get("/semua/count", komentarController.countAll.bind(komentarController))
router.get("/foto/count/:FotoID", komentarController.countByFotoID.bind(komentarController))
router.get("/user/count", authMiddleware, komentarController.countByUserID.bind(komentarController));
router.put("/:id", komentarController.update.bind(komentarController))
router.delete("/:id", komentarController.delete.bind(komentarController))

module.exports = router;