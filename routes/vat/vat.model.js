const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  vat = sequelize.define("vat", {   
    purchase_total_amount: {
      type:DataTypes.INTEGER(),
      allowNull: false
    },
    sales_total_amount: {
      type:DataTypes.INTEGER(),
      allowNull: false
    },
    total_tax_amount: {
      type: DataTypes.INTEGER(),
      allowNull: false
    },
    

  });
  return vat;
};
