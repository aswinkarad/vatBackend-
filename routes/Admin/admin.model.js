const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  admin = sequelize.define("admin", {
    name:{
      type: DataTypes.STRING(40),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile:{
      type: DataTypes.STRING(20),
      unique: "mobile",
      allowNull: false
    },
  });
  return admin;
};
  