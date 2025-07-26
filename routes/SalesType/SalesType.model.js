const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const sale_type = sequelize.define("sale_type", {
    saletype: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  });

  return sale_type;
};

