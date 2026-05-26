
const { Sequelize } = require("sequelize");
console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: "postgres",

    protocol: "postgres",

    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;