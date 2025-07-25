const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const purchase = sequelize.define("purchase", {
    // name: {
    //   type: DataTypes.STRING, // Adjust length or constraints as needed, e.g., DataTypes.STRING(100)
    //   allowNull: false, // Set to true if the field can be nullable
    // },
    date: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER(),
      allowNull: false
    },
    purchase_tax_amount: {
      type: DataTypes.INTEGER(),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  });
  return purchase;
};