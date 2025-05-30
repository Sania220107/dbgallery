const User = require("../models/user")
const userDto = require("../common/dto/userDto")
const AdminDto = require("../common/dto/adminDto")
const { hashPassword, checkPassword } = require("../common/utils/securityUtils");
const { Op } = require("sequelize");
const moment = require("moment")

class UserRepository {
  async create(data) {
    try {
      if (!data.Username) throw new Error("Username harus disediakan");

      data.Password = await hashPassword(data.Password);

      const user = await User.create(data);
      return new userDto(user);
    } catch (error) {
      throw new Error("Gagal membuat pengguna baru: " + error.message);
    }
  }

  async getAll() {
    try {
      const user = User.findAll();
      return user;
    } catch (error) {
      throw new Error("Gagal mengambil semua data pengguna: " + error.message);
    }
  }

  async getById(UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }
      return new userDto(user);
    } catch (error) {
      throw new Error(
        "Gagal mengambil data pengguna berdasarkan ID: " + error.message
      );
    }
  }

  async getUserByEmail(Email) {
    return await User.findOne({
      where: { Email: Email },
      attributes: ["UserID", "Username", "Email", "Password", "role"],
    });
  }

  async searchUser(dto) {
    try {
      const currenct = dto.search
        ? {
            Username: { [Op.like]: `%${dto.search}%` },
          }
        : {};
      const user = await User.findAll({
        where: currenct,
      });
      return user.map((users) => new userDto(users));
    } catch (error) {
      throw new Error(
        "Gagal mencari pengguna berdasarkan Username: " + error.message
      );
    }
  }

  async getByUserID(UserID) {
    try {
      const user = await User.findAll(UserID);
      if (!user) {
        throw new Error("User tidak ditemukan");
      }
      return user;
    } catch (error) {
      throw new Error(
        "Gagal mengambil user berdasarkan UserID" + error.message
      );
    }
  }

  async update(UserID, data) {
    try {
      const user = await User.findAll({
        where: {
          UserID: UserID
        }
      });
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      if (data.Password) {
        data.Password = await hashPassword(data.Password);
      }

      await user.update(data);
      return new userDto(user);
    } catch (error) {
      throw new Error("Gagal memperbarui data pengguna: " + error.message);
    }
  }

  async updatePassword(UserID, OldPassword, NewPassword) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      //Verifikasi apakah kata sandi lama benar
      const isOldPassword = await checkPassword(OldPassword, user.Password);
      if (!isOldPassword) {
        throw new Error("Kata sandi lama tidak valid");
      }

      //Enkripsi kata sandi baru
      const hashedNewPassword = await hashPassword(NewPassword);

      //Perbarui kata sandi pengguna
      await user.update({ Password: hashedNewPassword });

      return new userDto(user);
    } catch (error) {
      throw new Error("Gagal mengubah kata sandi: " + error.message);
    }
  }

  async getSearchByUsername(Username) {
    try {
      const search = await User.findAll({
        where: {
          Username: {
            [Op.like]: `%${Username}%`,
          },
        },
      });
      return search;
    } catch (error) {
      throw new Error(
        "Gagal mencari data User berdasarkan User: " + error.message
      );
    }
  }

  async delete(UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      await user.destroy();
      return { message: "Pengguna berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus pengguna: " + error.message);
    }
  }

  async updateAccessToken(UserID, AccessToken, LastLogin) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      //Update token akses dan lastlogin
      await user.update({ AccessToken: AccessToken, LastLogin: LastLogin });

      return new userDto(user);
    } catch (error) {
      throw new Error("Gagal membuat token akses: " + error.message);
    }
  }

  async getActiveUsers() {
    try {
      const twoDaysAgo = moment().subtract(2, "days").toDate();
      return await User.findAll({
        where: {
          LastLogin: {
            [Op.gt]: twoDaysAgo, //LastLogin lebih besar dari 2 hari lalu
          },
        },
      });
    } catch (error) {
      throw new Error("Gagal mengambil data user aktif: " + error.message);
    }
  }

  async getUserIsactive() {
    try {
      const fiveDaysAgo = moment().subtract(5, "days").toDate();
      return await User.findAll({
        where: {
          [Op.or]: [
            { LastLogin: { [Op.lt]: fiveDaysAgo } },
            { LastLogin: null }, //Belum pernah login
          ],
        },
      });
    } catch (error) {
      throw new Error(
        "Gagal mengambil data user yang tidak aktof: " + error.message
      );
    }
  }

  async getUserdelete() {
    try {
      const user = await User.findAll({
        where: {
          DeletedAt: { [Op.not]: null },
        },
        paranoid: false,
      });
      return user;
    } catch (error) {
      throw new Error(
        "Gagal mengambil data user yang sudah dihapus: " + error.message
      );
    }
  }

  async getActiveUsersCount() {
    const twoDaysAgo = moment().subtract(2, "days").toDate();
    return await User.count({
      where: {
        LastLogin: { [Op.gt]: twoDaysAgo },
      },
    });
  }

  // Mendapatkan jumlah user tidak aktif (Login lebih dari 5 hari lalu atau belum pernah login)
  async getInactiveUsersCount() {
    const fiveDaysAgo = moment().subtract(5, "days").toDate();
    return await User.count({
      where: {
        [Op.or]: [
          { LastLogin: { [Op.lt]: fiveDaysAgo } },
          { LastLogin: null }, // Belum pernah login
        ],
      },
    });
  }

  async getDeletedUsersCount() {
    return await User.count({
      where: { DeletedAt: { [Op.not]: null } },
      paranoid: false, // Termasuk user yang sudah dihapus
    });
  }
}

module.exports = new UserRepository();