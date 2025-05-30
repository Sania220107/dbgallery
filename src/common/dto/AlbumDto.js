

class AlbumDto {
  constructor(album) {
    this.AlbumID = album.AlbumID;
    this.NamaAlbum = album.NamaAlbum;
    this.Deskripsi = album.Deskripsi;
    this.TanggalDibuat = album.TanggalDibuat;

    if(album.User) {
      this.User = {
          UserID: album.User.UserID,
          Username: album.User.Username,
          Profile: album.User.Profile
      }
    }
  }
}

module.exports = AlbumDto ;
