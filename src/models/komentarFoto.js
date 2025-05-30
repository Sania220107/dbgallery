const { DataTypes } = require("sequelize")
const sequelize = require("../config/databaseConfig")
const Foto = require("./foto")
const User = require("./user")
const moment = require("moment")

const Komentar = sequelize.define("Komentar", {
    KomentarID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FotoID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Foto,
            key: "FotoID"
        }
    },
    UserID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "UserID"
        }
    },
    IsiKomentar: {
        type: DataTypes.TEXT,
    },
    TanggalKomentar: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue("TanggalKomentar")).format (
                "DD-MM-YYYY"
            )
        }
    },
},{
    tableName: "komentarfoto",
    timestamps: true,
    paranoid: true
})

Komentar.belongsTo(Foto, { foreignKey: "FotoID"})
Foto.hasMany(Komentar, { foreignKey: "FotoID"})

Komentar.belongsTo(User, { foreignKey: "UserID"})
User.hasMany(Komentar, { foreignKey: "UserID"})

module.exports = Komentar;