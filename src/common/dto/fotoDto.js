class FotoDto {
  constructor(foto, includeAlbumFotos = false) {
    this.FotoID = foto.FotoID;
    this.JudulFoto = foto.JudulFoto;
    this.DeskrispiFoto = foto.DeskrispiFoto;
    this.TanggalUnggah = foto.TanggalUnggah;
    this.LokasiFile = foto.LokasiFile;
    this.AlbumID = foto.AlbumID;
    this.UserID = foto.UserID;

    if (foto.Album) {
      this.Album = {
        AlbumID: foto.Album.AlbumID,
        NamaAlbum: foto.Album.NamaAlbum,
        Deskripsi: foto.Album.Deskripsi,
        TanggalDibuat: foto.Album.TanggalDibuat,
      };
    }

    if (foto.User) {
      this.User = {
        UserID: foto.User.UserID,
        Username: foto.User.Username,
        Profile: foto.User.Profile,
      };
    }
  }
}

module.exports = FotoDto;
