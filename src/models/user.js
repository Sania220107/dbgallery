const { DataTypes } = require("sequelize")
const sequelize = require("../config/databaseConfig")

const User = sequelize.define("User", {
    UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: "Password harus memiliki panjang 6 hingga 100 karakter"
            },
            notNull: {
                msg: "Password harus diisi",
            }
        }
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Email telah digunakan"
        },
        validate: {
            isEmail: {
                msg: "Format email tidak valid",
            },
            notNull: {
                msg: "Email harus diisi"
            }
        }
    },
    NamaLengkap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Profile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },
    AccessToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
},{
    tableName: "user",
    timestamps: true,
    paranoid: true
})

module.exports = User;