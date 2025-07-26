const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const tax_type = sequelize.define("tax_type", {
    tax: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  });

  return tax_type;
};

