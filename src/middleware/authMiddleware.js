const { StatusCodes } = require("http-status-codes")
const { verifyToken } = require("../common/utils/jwtUtils");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse")

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    console.log("Authorization Header: ", token);

    if(!token || !token.startsWith("Bearer ")) {
        return res
        .status(StatusCodes.FORBIDDEN)
        .json(defaultBaseResponse(StatusCodes.FORBIDDEN, false, "Tidak ada token yang disediakan!"));
    }

    const tokens = token.split(" ")[1];
    console.log("Token yang diterima untuk verifikasi: ", tokens);

    try {
        const decoded = verifyToken(tokens);
        req.UserID = decoded.id; //Simpan ID pengguna untuk digunakan nanti
        console.log("Decoded", decoded)
        next();
    } catch (error) {
        console.error("Error verifikasi token: ", error);
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(defaultBaseResponse(StatusCodes.UNAUTHORIZED, false, "Token tidak terautentikasi"))
    }
}

module.exports = authMiddleware