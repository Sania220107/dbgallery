const Foto = require("../models/foto")
const Album = require("../models/Album")
const User = require("../models/user")
const fotoDto = require("../common/dto/fotoDto");
const { Op } = require("sequelize");

class FotoRepository {
  async create(data, UserID, LokasiFile) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      const foto = await Foto.create({
        ...data,
        LokasiFile, // Pastikan LokasiFile disimpan
        TanggalDiunggah: new Date(),
        UserID: UserID,
      });

      return new fotoDto(foto);
    } catch (error) {
      throw new Error(
        "Terjadi kesalahan saat menambahkan foto baru: " + error.message
      );
    }
  }

  async getAll() {
    try {
      const foto = await Foto.findAll({
        attributes: [
          "FotoID",
          "JudulFoto",
          "DeskripsiFoto",
          "LokasiFile",
          "TanggalUnggah",
        ],
        include: [
          {
            model: Album,
            attributes: ["AlbumID", "NamaAlbum", "Deskripsi", "TanggalDibuat"],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
      });

      return foto.map((gambar) => new fotoDto(gambar));
    } catch (error) {
      throw new Error(
        "Terjadi kesalahan saat mengambil semua foto: " + error.message
      );
    }
  }

  async getById(FotoID) {
    try {
      const foto = await Foto.findByPk(FotoID, {
        include: [
          {
            model: Album,
            attributes: ["AlbumID", "NamaAlbum", "Deskripsi", "TanggalDibuat"],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
      });
      if (!foto) {
        throw new Error("Foto tidak ditemukan");
      }
      return new fotoDto(foto);
    } catch (error) {
      throw new Error(
        "Terjadi kesalahan saat mengambil foto berdasarkan ID: " + error.message
      );
    }
  }

  async getByUserID(UserID) {
    try {
      const foto = await Foto.findAll({
        where: { UserID: UserID },
        include: [
          {
            model: Album,
            attributes: ["AlbumID", "NamaAlbum", "Deskripsi", "TanggalDibuat"],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
      });
      console.log("Data yang diterima getByUser: ", foto);
      return foto.map((photo) => new fotoDto(photo));
    } catch (error) {
      throw new Error(
        "Gagal mengambil foto berdasarkan UserID: " + error.message
      );
    }
  }

  async getByAlbumID(AlbumID) {
    if (!AlbumID) {
      throw new Error("AlbumID tidak tersedia");
    }
    try {
      const foto = await Foto.findAll({
        where: { AlbumID: AlbumID },
        include: [
          {
            model: Album,
            attributes: ["AlbumID", "NamaAlbum", "Deskripsi", "TanggalDibuat"],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
      });

      console.log("Data yang diterima berdasarkan album: ", foto);
      return foto.map((photo) => new fotoDto(photo));
    } catch (error) {
      throw new Error(
        "Gagal mengambil foto berdasarkan Album: " + error.message
      );
    }
  }

  async getCountByAlbumID(UserID, AlbumID) {
    try {
      const album = await Foto.count({
        where: {
          UserID: UserID,
          AlbumID: AlbumID,
        },
      });
      return album;
    } catch (error) {
      throw new Error("Gagal menghitung: " + error.message);
    }
  }

  async updateFoto(FotoID, data, fileLocation) {
    try {
      const foto = await Foto.findByPk(FotoID);
      if (!foto) {
        throw new Error("Foto tidak ditemukan");
      }

      // Update hanya data yang diberikan, termasuk LokasiFile jika ada file baru
      const updatedFoto = await foto.update({
        ...data, // update JudulFoto, DeskripsiFoto, dll
        LokasiFile: fileLocation, // update LokasiFile jika ada perubahan
      });
      return updatedFoto;
    } catch (error) {
      throw new Error(
        "Terjadi kesalahan saat memperbarui data foto: " + error.message
      );
    }
  }

  async delete(FotoID) {
    try {
      const foto = await Foto.findByPk(FotoID);
      if (!foto) {
        throw new Error("Foto tidak ditemukan");
      }
      await foto.destroy();
      return new fotoDto(foto);
    } catch (error) {
      throw new Error("Gagal menghapus foto" + error.message);
    }
  }

  async deleteByuser(UserID, FotoID) {
    try {
      const foto = await Foto.findByPk(FotoID);
      if (!foto) {
        throw new Error("foto tidak ditemukan");
      }

      if (foto.UserID !== UserID) {
        throw new Error("Anda tidak memiliki izin untuk menghapus foto ini");
      }

      await foto.destroy();
      return foto;
    } catch (error) {
      throw new Error("Gagal menghapus foto: " + error.message);
    }
  }

  async fotoTerhapus(UserID) {
    try {
      const history = await Foto.findAll({
        where: { 
          UserID: UserID, 
          DeletedAt: {
          [Op.ne]: null,
        }},
        paranoid: false,
      })
       return history
    } catch (error) {
      throw new Error("Gagal mnegambil data foto yang sudah dihapus: " + error.message)
    }
  }

  async restore(UserID, FotoID) {
    try {
      const restore = await Foto.restore({
        where: { 
          FotoID: FotoID,
          UserID: UserID,
          deletedAt: {
            [Op.ne]: null,
          }
        }
      })
      return restore
    } catch (error) {
      throw new Error("Gagal memulihkan foto: " + error.message);
    }
  }
}

module.exports = new FotoRepository();