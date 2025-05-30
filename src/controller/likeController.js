const express = require("express")
const router = express.Router();
const LikeRepository = require("../repository/likeRepository")
const { StatusCodes } = require("http-status-codes")
const authMiddleware = require("../middleware/authMiddleware");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");

class LikeController {
    async create(req, res) {
        try {
            const UserID =req.UserID;
            console.log("UserID dari akses token: ", UserID)
            const like = await LikeRepository.create(req.body, UserID)
            console.log("Data like yang diterima: ", like)
            return res
            .status(StatusCodes.CREATED)
            .json(defaultBaseResponse(StatusCodes.CREATED, true, "Berhasil menambahkan like", like))
        } catch (error) {
            console.log("Error menambahkan like: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menambahkan like"))
        }
    }

    async getAll(req, res) {
        try {
            const like = await LikeRepository.getAll()
            console.log("Data yang diterima: ", like)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil semua data like", like))
        } catch (error) {
            console.log("Error mengambil semua data like: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil semua data like"))
        }
    }

    async getById(req, res) {
        try {
            const like = await LikeRepository.getById(req.params.id) 
            console.log("Data yang diterima: ", like)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data like", like))
        } catch (error) {
            console.log("Error mengambil data like berdasarkan id: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data like"))
        }
    }

    async getByUserID(req, res) {
        const UserID = req.UserID;
        if(!UserID) {
            throw new Error("User tidak ditemukan");
        }
        try {
            const like = await LikeRepository.getByUserID(UserID);
            console.log("UserID yang diterima: ", UserID);
            console.log("Data Yang diterima: ", like)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data like berdasarkan UserID", like))
        } catch (error) {
            console.log("Error mengambil data like berdasarkan UserID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data like berdasarkan UserID"))
        }
    }

    async getByFotoID(req, res) {
        const UserID = req.UserID;
        const FotoID = req.params.FotoID;
        try {
            const like = await LikeRepository.getByFotoID(FotoID, UserID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data like berdasarkan FotoID", like))
        } catch (error) {
            console.log("Error mengambil data like berdasarkan FotoID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data like berdasarkan FotoID"))
        }
    }

    async countAll(req, res) {
        try {
            const like = await LikeRepository.countAll();
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung semua like", like))
        } catch (error) {
            console.log("Error menghitung semua like: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung semua like"))
        }
    }

    async countFotoByID(req, res) {
        try {
            const FotoID = req.params.FotoID;
            const like = await LikeRepository.countByFotoID(FotoID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung like berdasarkan foto", like))
        } catch (error) {
            console.log("Error saat menghitung like berdasarkan Foto: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung like berdasarkan foto"))
        }
    }

    async countFotoByUserID(req, res) {
        const UserID = req.UserID;
        try {
            const foto = await LikeRepository.countLikesByUser(UserID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil", foto))
        } catch (error) {
            console.log("Error: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Gagal"))
        }
    }


    async countByUserID(req, res) {
        const UserID = req.UserID;
        try {
            const like = await LikeRepository.countByUserID(UserID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung like berdasarkan UserID", like))
        } catch (error) {
            console.log("Error menghitung jumlah like berdasarkan UserID: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghitung jumlah like berdasarkan UserID"))
        }
    }
    async update(req, res) {
        try {
            const like = await LikeRepository.update(req.params.id)
            console.log("Data yang diterima: ", like)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil memperbarui like", like))
        } catch (error) {
            console.log("Error memperbarui data like: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat memperbarui like"))
        }
    }

    async delete(req, res) {
        try {
            const like = await LikeRepository.delete(req.params.id)
            console.log("Data yang diterima: ", like)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghapus like", like))
        } catch (error) {
            console.log("Error menghapus like: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghapus like"))
        }
    }

    async deleteByFotoID(req, res) {
        try {
            const like = await LikeRepository.deleteByFotoID(req.params.FotoID);
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghapus like berdasarkan FotoID", like))
        } catch (error) {
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghapus like berdasarkan FotoID"))
        }
    }
}

const likeController = new LikeController();

router.post("/", authMiddleware, likeController.create.bind(likeController))
router.get("/", likeController.getAll.bind(likeController))
router.get("/:id", likeController.getById.bind(likeController))
router.get("/user/me", authMiddleware,likeController.getByUserID.bind(likeController))
router.get("/foto/:FotoID", likeController.getByFotoID.bind(likeController))
router.get("/semua/count", likeController.countAll.bind(likeController))
router.get("/foto/count/:FotoID", likeController.countFotoByID.bind(likeController))
router.get("/users/count", authMiddleware, likeController.countByUserID.bind(likeController))
router.put("/:id", likeController.update.bind(likeController))
router.get("/foto/semua/count", authMiddleware, likeController.countFotoByUserID.bind(likeController))
router.delete("/:id", likeController.delete.bind(likeController))
router.delete("/foto/:FotoID", likeController.deleteByFotoID.bind(likeController))

module.exports = router;