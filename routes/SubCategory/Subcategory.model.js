const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const subcategory = sequelize.define("subcategory", {
    sub_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  });

  return subcategory;
};


  