const express = require("express")
const router = express.Router();
const AlbumRepository = require("../repository/AlbumRepository")
const { StatusCodes } = require("http-status-codes")
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const authMiddleware = require("../middleware/authMiddleware");

class AlbumController {
    async create(req, res) {
        try {
            const UserID = req.UserID;
            console.log(UserID)
            const album = await AlbumRepository.create(req.body, UserID)
            res
            .status(StatusCodes.CREATED)
            .json(defaultBaseResponse(StatusCodes.CREATED, true, "Berhasil membuat album baru", album))
        } catch (error) {
            console.log("Error saat membuat album baru: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat membuat album"))
        }
    }

    async getAll(req, res) {
        try {
            const album = await AlbumRepository.getAll()
            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data album", album))
        } catch (error) {
            console.log("Error saat mengambil semua data album: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data album"))
        }
    }

    async getById(req, res) {
        try {
            const album = await AlbumRepository.getById(req.params.id)
            if(!album) {
                res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "Album tidak ditemukan"))
            }
            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data album: ", album))
        } catch (error) {
            console.log("Error saat mengambil data album berdasarkan ID: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil album"))
        }
    }

    async getByUserID(req, res) {
        const UserID = req.UserID;
        console.log("UserID: ", UserID)
        try {
            const album = await AlbumRepository.getByUserID(UserID)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data album berdasarkan UserID", album))
        } catch (error) {
            console.log("Error mengambil album berdasarkan UserID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil album berdasarkan UserID"))
        }
    }

    async update(req, res) {
        try {
            const album = await AlbumRepository.update(req.params.id, req.body);
            if(!album) {
                res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "Album tidak ditemukan"))
            }

            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil memperbarui data album: ", album))
        } catch (error) {
            console.log("Error saat memperbarui data album: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat memperbarui album"))
        }
    }

    async delete(req, res) {
        try {
            const album = await AlbumRepository.delete(req.params.id);
            if(!album) {
                res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "Album tidak ditemukan"))
            }

            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghapus data album: ", album))
        } catch (error) {
            console.log("Error saat menghapus data album: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengahapus data album"))
        }
    }
}

const albumController = new AlbumController();

//Router
router.post("/", authMiddleware, albumController.create.bind(albumController))
router.get("/", albumController.getAll.bind(albumController))
router.get("/:id", albumController.getById.bind(albumController))
router.get("/users/me", authMiddleware, albumController.getByUserID.bind(albumController))
router.put("/:id", albumController.update.bind(albumController))
router.delete("/:id", albumController.delete.bind(albumController))

module.exports = router;