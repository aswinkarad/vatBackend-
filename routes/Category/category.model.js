const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define("category", {
    cat_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  });

  return category;
};


  