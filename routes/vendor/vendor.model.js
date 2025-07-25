// models/vendor.js
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define("vendor", {
    vendor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Vendor;
};

