const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    bill = sequelize.define("bill", {
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE(),
            allowNull: false,
          },

  });
  return bill;
};
  