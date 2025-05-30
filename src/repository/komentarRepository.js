const Komentar = require("../models/komentarFoto")
const Foto = require("../models/foto")
const User = require("../models/user")
const KomentarDto = require("../common/dto/komentarDto")

class KomentarRepository {
  async create(data, UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("User tidak ditemukan");
      }
      const komentar = await Komentar.create({
        ...data,
        TanggalKomentar: new Date(),
        UserID: UserID,
      });

      return new KomentarDto(komentar);
    } catch (error) {
      throw new Error("Gagal membuat komentar" + error.message);
    }
  }

  async getAll() {
    try {
      const komentar = await Komentar.findAll({
        include: [
          {
            model: Foto,
            attributes: [
              "JudulFoto",
              "DeskripsiFoto",
              "LokasiFile",
              "TanggalUnggah",
            ],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
        order: [["TanggalKomentar", "DESC"]],
      });
      return komentar.map((comment) => new KomentarDto(comment));
    } catch (error) {
      throw new Error("Gagal mengambil semua komentar: " + error.message);
    }
  }

  async getById(KomentarID) {
    try {
      const komentar = await Komentar.findByPk(KomentarID);
      if (!komentar) {
        throw new Error("Komentar tidak ditemukan");
      }
      return new KomentarDto(komentar);
    } catch (error) {
      throw new Error(
        "Gagal mengambil komentar berdasarkan id: " + error.message
      );
    }
  }

  async getByUserID(UserID) {
    try {
      const komentar = await Komentar.findAll({
        where: { UserID: UserID },
        include: [
          {
            model: Foto,
            attributes: [
              "FotoID",
              "JudulFoto",
              "DeskripsiFoto",
              "LokasiFile",
              "TanggalUnggah",
            ],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
      });
      return komentar.map((comment) => new KomentarDto(comment));
    } catch (error) {
      throw new Error(
        "Gagal mengambil komentar berdasarkan UserID: " + error.message
      );
    }
  }

  async getBYFotoID(FotoID) {
    try {
      const komentar = await Komentar.findAll({
        where: { FotoID: FotoID },
        include: [
          {
            model: Foto,
            attributes: [
              "FotoID",
              "JudulFoto",
              "DeskripsiFoto",
              "LokasiFile",
              "TanggalUnggah",
            ],
          },
          {
            model: User,
            attributes: ["UserID", "Username", "Profile"],
          },
        ],
        order: [["TanggalKomentar", "DESC"]],
      });

      // Pastikan bahwa User dan Foto tetap ada dalam respons
      return komentar.map((comment) => ({
        KomentarID: comment.KomentarID,
        FotoID: comment.FotoID,
        UserID: comment.UserID,
        IsiKomentar: comment.IsiKomentar,
        TanggalKomentar: comment.TanggalKomentar,
        User: comment.User // Pastikan user tetap ada
          ? {
              UserID: comment.User.UserID,
              Username: comment.User.Username,
              Profile: comment.User.Profile,
            }
          : null,
        Foto: comment.Foto // Pastikan foto tetap ada
          ? {
              FotoID: comment.Foto.FotoID,
              JudulFoto: comment.Foto.JudulFoto,
              DeskripsiFoto: comment.Foto.DeskripsiFoto,
              LokasiFile: comment.Foto.LokasiFile,
              TanggalUnggah: comment.Foto.TanggalUnggah,
            }
          : null,
      }));
    } catch (error) {
      throw new Error(
        "Gagal mengambil data komentar berdasarkan FotoID: " + error.message
      );
    }
  }

  async CountAll() {
    try {
      const count = await Komentar.count();
      console.log("Jumlah komentar: ", count);
      return count;
    } catch (error) {
      throw new Error("Gagal menghitung total komentar: " + error.message);
    }
  }

  async countByFotoID(FotoID) {
    try {
      const count = await Komentar.count({
        where: { FotoID: FotoID },
      });
      console.log("Jumlah komentar berdasarkan Foto: ", count);
      return count;
    } catch (error) {
      throw new Error(
        "Gagal menghitung komentar berdasarkan Foto: " + error.message
      );
    }
  }

  async countByUserID(UserID) {
    try {
      const count = await Komentar.count({
        where: { UserID: UserID },
      });
      console.log("Jumlah komentar berdasarkan UserID: ", count);
      return count;
    } catch (error) {
      throw new Error(
        "Gagal menghitung komentar berdasarkan UserID: " + error.message
      );
    }
  }

  async update(KomentarID, data) {
    try {
      const komentar = await Komentar.findByPk(KomentarID);
      if (!komentar) {
        throw new Error("Komentar tidak ditemukan");
      }
      await komentar.update(data);
      return new KomentarDto(komentar);
    } catch (error) {
      throw new Error("Gagal memperbarui komentar: " + error.message);
    }
  }

  async delete(KomentarID) {
    try {
      const komentar = await Komentar.findByPk(KomentarID);
      if (!komentar) {
        throw new Error("Komentar tidak ditemukan");
      }
      await komentar.destroy();
      return new KomentarDto(komentar);
    } catch (error) {
      throw new Error("Gagal menghapus komentar: " + error.message);
    }
  }
}

module.exports = new KomentarRepository();