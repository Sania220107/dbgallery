const { DataTypes } = require("sequelize")
const sequelize = require("../config/databaseConfig")
const Foto = require("./foto")
const User = require("./user")

const LikeFoto = sequelize.define("LikeFoto", {
    LikeID: {
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
        allowNull: false,
        references: {
            model: User,
            key: "UserID"
        }
    },
    TanggalLike: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "likefoto",
    timestamps: true, 
    paranoid: true
})

LikeFoto.belongsTo(Foto, { foreignKey: "FotoID"})
Foto.hasMany(LikeFoto, { foreignKey: "FotoID"})

LikeFoto.belongsTo(User, { foreignKey: "UserID"})
User.hasMany(LikeFoto, { foreignKey: "UserID"})
module.exports = LikeFoto;