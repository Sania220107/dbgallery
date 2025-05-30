const Like = require("../models/likeFoto")
const Foto = require("../models/foto")
const User = require("../models/user")
const likeDto = require("../common/dto/likeDto");
const { Op, fn, col } = require("sequelize");

class LikeRepository {
  async create(data, UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("User tidak ditemukan");
      }
      const like = await Like.create({
        ...data,
        TanggalLike: new Date(),
        UserID: UserID,
      });

      return new likeDto(like);
    } catch (error) {
      throw new Error("Gagal menambahkan like: " + error.message);
    }
  }

  async getAll() {
    try {
      const like = await Like.findAll({
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
      return like.map((Like) => new likeDto(Like));
    } catch (error) {
      throw new Error("Gagal mengambil semua data like: " + error.message);
    }
  }

  async getById(LikeID) {
    try {
      const like = await Like.findByPk(LikeID, {
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
      if (!like) {
        throw new Error("Like tidak ditemukan");
      }
      return new likeDto(like);
    } catch (error) {
      throw new Error(
        "Gagal mengambil data like berdasarkan id: " + error.message
      );
    }
  }

  async getByUserID(UserID) {
    try {
      const like = await Like.findAll({
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
      return like.map((likes) => new likeDto(likes));
    } catch (error) {
      throw new Error(
        "Gagal mengambil data like berdasarkan UserID: " + error.message
      );
    }
  }

  async getByFotoID(FotoID) {
    try {
      const like = await Like.findAll({
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
      });
      return like.map((likes) => new likeDto(likes));
    } catch (error) {
      throw new Error(
        "Gagal mengambil data like berdasarkan FotoID: " + error.message
      );
    }
  }

  async countAll() {
    try {
      const like = await Like.count();
      return like;
    } catch (error) {
      throw new Error("Gagal menghitung semua like: " + error.message);
    }
  }

  async countByFotoID(FotoID) {
    try {
      const like = await Like.count({
        where: { FotoID: FotoID },
      });
      return like;
    } catch (error) {
      throw new Error(
        "Gagal menghitung like berdasarkan Foto: " + error.message
      );
    }
  }

  async countLikesByUser(UserID) {
    try {
      const photos = await Foto.findAll({
        where: { UserID: UserID },
        attributes: ["FotoID"],
      });
      const fotoIDs = photos.map((photo) => photo.FotoID);

      
      const totalLikes = await Like.count({
        where: {
          UserID: UserID,

          FotoID: { [Op.in]: fotoIDs },
        },
      });

      return totalLikes; 
    } catch (error) {
      throw new Error("Gagal menjumlahkan: " + error.message);
    }
  }

  async countByUserID(UserID) {
    try {
      const like = await Like.count({
        where: { UserID: UserID },
      });
      return like;
    } catch (error) {
      throw new Error(
        "Gagal menghitung like berdasarkan UserID: " + error.message
      );
    }
  }

  async update(LikeID, data) {
    try {
      const like = await Like.findByPk(LikeID);
      if (!like) {
        throw new Error("Like tidak ditemukan");
      }
      await like.update(data);
      return new likeDto(like);
    } catch (error) {
      throw new Error("Gagal memperbarui like: " + error.message);
    }
  }

  async delete(LikeID) {
    try {
      const like = await Like.findByPk(LikeID);
      if (!like) {
        throw new Error("Like tidak ditemukan");
      }
      await like.destroy();
      return new likeDto(like);
    } catch (error) {
      throw new Error("Gagal menghapus like: " + error.message);
    }
  }

  async deleteByFotoID(FotoID) {
    try {
      const likes = await Like.findAll({ where: { FotoID } });

      if (likes.length === 0) {
        throw new Error("Tidak ada like yang ditemukan untuk FotoID ini.");
      }

      await Like.destroy({ where: { FotoID } });

      return new likeDto(likes);
    } catch (error) {
      throw new Error("Gagal menghapus like: " + error.message);
    }
  }
}

module.exports = new LikeRepository();