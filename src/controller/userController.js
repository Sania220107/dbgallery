const express = require("express")
const router = express.Router();
const UserRepository = require("../repository/userRepository")
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse")
const { StatusCodes } = require("http-status-codes")
const authMiddleware = require("../middleware/authMiddleware")
const uploads = require("../middleware/multerConfig")

class UserController {
    async create(req, res) {
        const Profile = req.file ? req.file.filename : null;
        try {
            const { Username, NamaLengkap, Password, Alamat, Email  } = req.body;
            const user = await UserRepository.create({
                NamaLengkap,
                Username,
                Email,
                Password,
                Alamat,
                Profile
            });

            console.log("Profile yang di uploads: ", Profile)
            console.log("Data yang diterima: ", user)
            res
            .status(StatusCodes.CREATED)
            .json(defaultBaseResponse(StatusCodes.CREATED, true, " Pengguna berhasil dibuat", user))
        } catch (error) {
            console.log("Error saat membuat user: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat membuat user baru"))
        }
    }

    async getAll(req, res) {
        try {
            let users = await UserRepository.getAll();

            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Data user berhasil diambil", users))
            
        } catch (error) {
            console.log("Error saat mengambil semua data user: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data user"))
        }
    }

    async getById(req, res) {
        try {
            const user = await UserRepository.getById(req.params.id);
            if(!user) {
                res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "User tidak ditemukan"))
            }

            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Success", user))
        } catch (error) {
            console.log("Error: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data user"))
        }
    }

    async getSearch(req, res) {
        try {
            const { page = 1, per_page = 5, search = "" } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const perPageNumber = parseInt(per_page, 10) || 5;
            
            const dto = { page: pageNumber, per_page: perPageNumber, search };
            const users = await UserRepository.searchUser(dto)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Hasil pencarian user berdasarkan Username", users))
        } catch (error) {
            console.log("Error pencarian: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat melakukan pencarian:"))
        }
    }

    async getProfileUser(req, res) {
        try {
            const user = await UserRepository.getById(req.UserID)
            if(user === null) {
                res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "Data not found"))
            }
            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Success", user))
        } catch (error) {
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Gagal"))
        }
    }



    async update(req, res) {
        const UserID= req.UserID;
        const { NamaLengkap, Username, Email, Password, Alamat} = req.body
        
        try {
            const Profile = req.file ? req.file.filename : null;
            const user = await UserRepository.update({
              NamaLengkap,
              Username,
              Email,
              Password,
              Alamat,
              Profile,
              UserID,
            });
            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil memperbarui user", user))
        } catch (error) {
            console.log("Error: ", error)
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json(
                defaultBaseResponse(
                  StatusCodes.INTERNAL_SERVER_ERROR,
                  false,
                  "Terjadi kesalahan saat memperbarui data pengguna"
                )
              );
        }
    }

    async updatePassword(req, res) {
        try {
            const { OldPassword, NewPassword } = req.body;
            const UserID = req.UserID;

            if(!OldPassword || !NewPassword) {
                return res
                .status(StatusCodes.BAD_REQUEST)
                .json(defaultBaseResponse(StatusCodes.BAD_REQUEST, false, "Kata sandi lama dan baru harus di sediakan"))
            }

            const updatedUser = await UserRepository.updatePassword(
                UserID,
                OldPassword,
                NewPassword
            )

            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Kata sandi berhasil diperbarui: ", updatedUser))
        } catch (error) {
            console.log("Error mengubah kata sandi: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.OK, false, error.message))
        }
    }

    async getSearchByUsername(req, res) {
        try {
            const {Username} = req.query;
            const search = await UserRepository.getSearchByUsername(Username);
            console.log("Hasil dari pencarian user berdasarkan Username: ", search)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mencari data user berdasarkan username", search))
        } catch (error) {
            console.log("Error mencari data user berdasarkan Username: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mencari data user berdasarkan Username"))
        }
    }

    async delete(req, res) {
        try {
            await UserRepository.delete(req.params.id);
            res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghapus data user: "))
        } catch (error) {
            console.log("Error delete user: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat menghapus data user"))
        }
    }

    async getUserActive(req, res) {
        try {
            const user = await UserRepository.getActiveUsers()
            console.log("Data user yang aktif: ", user)
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data user yang aktif", user))
        } catch (error) {
            console.log("Error mengambil data user yang aktif: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat nmengmabil data user yang aktif"))
        }
    }

    async getUserIsactive(req, res) {
        try {
            const user = await UserRepository.getUserIsactive();
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data user yang tidak aktif", user))
        } catch (error) {
            console.log("Error mengambil data user yang tidak aktif: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data user yang tidak aktif"))
        }
    }

    async getUserdelete(req, res){
        try {
            const users = await UserRepository.getUserdelete();
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil mengambil data user yang sudah dihapus", users))
        } catch (error) {
            console.log("Error mengambil data user yang sudah dihapus: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat mengambil data user yang sudah dihapus"))
        }
    }

    async getCountActive(req, res) {
        try {
            const user = await UserRepository.getActiveUsersCount()
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung jumlah user aktiv", user))
        } catch (error) {
            console.log("Error menghitung jumlah aktif: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat user aktif"))
        }
    }

    async getCountIsctive(req, res) {
        try {
            const user = await UserRepository.getInactiveUsersCount()
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung jumlah user tidak aktiv", user))
        } catch (error) {
            console.log("Error menghitung jumlah tidak aktif: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat user aktif"))
        }
    }

    async getCountDelete(req, res) {
        try {
            const user = await UserRepository.getDeletedUsersCount()
            return res
            .status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Berhasil menghitung jumlah user aktiv", user))
        } catch (error) {
            console.log("Error menghitung jumlah aktif: ", error)
            return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Terjadi kesalahan saat user aktif"))
        }
    }
}

const userController = new UserController();

//Router
router.post("/", uploads.single("Profile"), userController.create.bind(userController))
router.get("/search", userController.getSearch.bind(userController))
router.get("/", authMiddleware, userController.getAll.bind(userController))
router.get("/profile", authMiddleware, userController.getProfileUser.bind(userController))
router.get("/search/username", userController.getSearchByUsername.bind(userController))
router.get("/:id", authMiddleware, userController.getById.bind(userController))
router.get("/users/active", userController.getUserActive.bind(userController))
router.get("/users/isactive", userController.getUserIsactive.bind(userController))
router.get("/active/count", userController.getCountActive.bind(userController))
router.get("/isactive/count", userController.getCountIsctive.bind(userController))
router.get("/delete/count", userController.getCountDelete.bind(userController))
router.get("/users/delete", userController.getUserdelete.bind(userController))
router.put("/", uploads.single("Profile"), authMiddleware, userController.update.bind(userController))
router.put("/update/password", authMiddleware, userController.updatePassword.bind(userController))
router.delete("/:id", authMiddleware, userController.delete.bind(userController))

module.exports = router;