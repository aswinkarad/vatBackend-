const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  sale = sequelize.define("sale", {
    date: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    amount:{
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    sale_tax_amount: {
      type:DataTypes.INTEGER(),
      allowNull: false
    },
    status:{
      type: DataTypes.BOOLEAN,
      defaultValue: true
  }
    
  });
  return sale;
};
  