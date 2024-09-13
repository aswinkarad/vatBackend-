const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  company = sequelize.define("company", {
    name:{
      type: DataTypes.STRING(40),
      allowNull: false
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile:{
      type: DataTypes.STRING(20),
      allowNull: false
    },
    location: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    ved: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    
  });
  return company;
};
  