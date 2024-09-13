const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  client = sequelize.define("client", {
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
      // unique: "Phone",
      allowNull: false
    },
   
  });
  return client;
};
  