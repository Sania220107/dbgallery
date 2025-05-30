class KomentarDto {
    constructor(komentar) {
        this.KomentarID = komentar.KomentarID,
        this.FotoID = komentar.FotoID,
        this.UserID = komentar.UserID,
        this.IsiKomentar = komentar.IsiKomentar,
        this.TanggalKomentar = komentar.TanggalKomentar

        if(komentar.Foto) {
            this.Foto = {
                FotoID: komentar.Foto.FotoID,
                JudulFoto: komentar.Foto.JudulFoto,
                DeskripsiFoto: komentar.Foto.DeskripsiFoto,
                TanggalDiunggah: komentar.Foto.TanggalDiunggah,
                LokasiFile: komentar.Foto.LokasiFile
            }
        }

        if(komentar.User) {
            this.User = {
                UserID: komentar.User.UserID,
                Username: komentar.User.Username,
                Profile: komentar.User.Profile
            }
        }
    }
}

module.exports = KomentarDto;