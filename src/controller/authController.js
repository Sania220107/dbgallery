const express = require("express")
const router = express.Router()
const UserRepository = require("../repository/userRepository")
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse")
const { StatusCodes } = require("http-status-codes")
const { checkPassword } = require("../common/utils/securityUtils")
const { generateToken } = require("../common/utils/jwtUtils")

class AuthController {
    async login(req, res) {
        const { Email, Password } = req.body;

        if(!Email || !Password) {
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json(defaultBaseResponse(StatusCodes.BAD_REQUEST, false, "Email dan Password harus disediakan"))
        }
        try {
            const loginAttemptTime = new Date();
            console.log(`Login attempt at: ${loginAttemptTime.toISOString()}`);

            const user = await UserRepository.getUserByEmail(Email);
            if(!user) {
                return res
                .status(StatusCodes.NOT_FOUND)
                .json(defaultBaseResponse(StatusCodes.NOT_FOUND, false, "Email not Found"));
            }

            if(!Password) {
                console.log(`Password tidak ditemukan untuk email: ${Email}`);
                return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "Password tidak ditemukan, silahkan coba lagi"));
            }

            console.log("Password yang dimasukan: ", Password);
            console.log("hash Password dari database: ", user.Password)

            //Validasi kata sandi
            const isPasswordValid = await checkPassword(Password, user.Password);
            console.log("Apakah Password valid?", isPasswordValid);

            if (!isPasswordValid) {
              console.warn(
                `Login failed: Inccorect password for email - ${Email}`
              );
              return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                  defaultBaseResponse(
                    StatusCodes.UNAUTHORIZED,
                    null,
                    "Kata sandi salah"
                  )
                );
            }

            const accessToken = generateToken(user.UserID);
            const lastLogin = new Date();
            await UserRepository.updateAccessToken(user.UserID, accessToken, lastLogin);

            //Respon berhasil login
            res.status(StatusCodes.OK)
            .json(defaultBaseResponse(StatusCodes.OK, true, "Login successfully", 
                {
                    UserID: user.UserID,
                    Username: user.Username,
                    Email: user.Email,
                    role: user.role,
                    AccessToken: accessToken,
                }
            ))
        } catch (error) {
            console.log("Error doring: ", error)
            res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(defaultBaseResponse(StatusCodes.INTERNAL_SERVER_ERROR, false, "An error occured"))
        }
    }
}

const authController = new AuthController();

//Router
router.post("/login", authController.login.bind(authController))

module.exports = router;