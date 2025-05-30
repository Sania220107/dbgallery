const { Sequelize } = require("sequelize");
require("dotenv").config();

const loggingOptional = process.env.DB_LOGGING === "true" ? console.log : false;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306, // Default port MySQL
    logging: loggingOptional,
  }
);

// Mengautentikasi koneksi ke database
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error connecting to database:", err));

module.exports = sequelize;