const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const moment = require("moment/moment");
const User = require("./user");

const Album = sequelize.define(
  "Album",
  {
    AlbumID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    NamaAlbum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    TanggalDibuat: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("TanggalDibuat")).format("DD-MM-YYYY");
      },
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "UserID",
      },
    },
  },
  {
    tableName: "album",
    timestamps: true,
    paranoid: true,
  }
);

Album.belongsTo(User, { foreignKey: "UserID" });
User.hasMany(Album, { foreignKey: "UserID" });

module.exports = Album;