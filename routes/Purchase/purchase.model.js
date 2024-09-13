const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  purchase = sequelize.define("purchase", {
    date: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER(),
      allowNull: false
    },
    purchase_tax_amount: {
      type:DataTypes.INTEGER(),
      allowNull: false
    },
    status:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
  }

  });
  return purchase;
};
