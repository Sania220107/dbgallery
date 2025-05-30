const { DataTypes } = require("sequelize")
const sequelize = require("../config/databaseConfig")
const Album = require("./Album")
const User = require("./user")
const moment = require("moment")

const Foto = sequelize.define("Foto", {
    FotoID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    JudulFoto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DeskripsiFoto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TanggalUnggah: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue("TanggalUnggah")).format(
                "DD-MM-YYYY"
            )
        }
    },
    LokasiFile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    AlbumID: {
        type: DataTypes.INTEGER,
        references: {
            model: Album,
            key: "AlbumID"
        }
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "UserID"
        }
    }
},{
    tableName: "foto",
    timestamps: true,
    paranoid: true
})

Foto.belongsTo(Album, { foreignKey: "AlbumID"})
Album.hasMany(Foto, { foreignKey: "AlbumID"})

Foto.belongsTo(User, { foreignKey: "UserID"})
User.hasMany(Foto, { foreignKey: "UserID"})

module.exports = Foto;