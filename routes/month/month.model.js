const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    month = sequelize.define("month", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },  
       
  });
  return month;
};
  