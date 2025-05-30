class LikeFoto {
    constructor(like) {
        this.LikeID = like.LikeID;
        this.FotoID = like.FotoID;
        this.UserID = like.UserID;
        this.TanggalLike = like.TanggalLike;

        if(like.User) {
            this.User = {
                UserID: like.User.UserID,
                Username: like.User.Username,
                Profile: like.User.Profile
            }
        }

        if(like.Foto) {
            this.Foto = {
                FotoID: like.Foto.FotoID,
                JudulFoto: like.Foto.JudulFoto,
                DeskripsiFoto: like.Foto.DeskripsiFoto,
                TanggalUnggah: like.Foto.TanggalUnggah,
                LokasiFile: like.Foto.LokasiFile
            }
        }
    }
}

module.exports = LikeFoto;