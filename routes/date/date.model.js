const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  date = sequelize.define("date", {
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  });
  return date;
};
  