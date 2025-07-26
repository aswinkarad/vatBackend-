const config = require('./database');
const { Sequelize, DataTypes } = require('sequelize');
// const Sequelize = require('sequelize')

// INITIALIZATION--
const sequelize = new Sequelize(
  config.database, config.username, config.password,
  {
    host: config.host,
    // port:'25060',
    dialect: "mysql"
  });


// AUTHENTICATION--
sequelize.authenticate()
  .then(() => {
    console.log('--database connected--');
  }).catch(err =>
    console.log(`Error:${err}`));


// CONNECTION-PROVIDER--
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.client = require('../routes/client/client.model')(sequelize, DataTypes);
db.month = require('../routes/month/month.model')(sequelize, DataTypes);
db.bill = require('../routes/bill/bill.model')(sequelize, DataTypes);
db.admin = require('../routes/Admin/admin.model')(sequelize, DataTypes);
db.purchase = require('../routes/Purchase/purchase.model')(sequelize, DataTypes);
db.sale = require('../routes/sales/sale.model')(sequelize, DataTypes);
db.company = require('../routes/Company/company.model')(sequelize, DataTypes); 
db.vat = require('../routes/vat/vat.model')(sequelize, DataTypes); 
db.vendor = require('../routes/vendor/vendor.model')(sequelize, DataTypes);
db.sale_type = require('../routes/SalesType/SalesType.model')(sequelize, DataTypes);
db.category = require('../routes/Category/category.model')(sequelize, DataTypes);
db.subcategory = require('../routes/SubCategory/Subcategory.model')(sequelize, DataTypes);
db.tax_type = require('../routes/Purchase/Tax.model')(sequelize, DataTypes);

//tax_type and purchase Association
db.tax_type.hasOne(db.purchase, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.purchase.belongsTo(db.tax_type)
db.client.hasOne(db.company, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.company.belongsTo(db.client)

db.vendor.hasOne(db.purchase, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.purchase.belongsTo(db.vendor)

db.client.hasOne(db.vendor, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.vendor.belongsTo(db.client)

//sale and sale_type Association
db.sale_type.hasOne(db.sale, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.sale.belongsTo(db.sale_type)

db.client.hasOne(db.sale_type, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.sale_type.belongsTo(db.client)

// company and vat 1-1
db.company.hasOne(db.vat, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.vat.belongsTo(db.company)

db.company.hasOne(db.sale, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.sale.belongsTo(db.company)


db.company.hasOne(db.bill, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.bill.belongsTo(db.company)



db.company.hasOne(db.purchase, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.purchase.belongsTo(db.company)


//category and subcategory Association
db.category.hasOne(db.subcategory, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.subcategory.belongsTo(db.category)

//subcategory and purchase Association
db.subcategory.hasOne(db.purchase, {
  foreignKey: {
    allowNull: true
  },
  onDelete: 'RESTRICT',
})
db.purchase.belongsTo(db.subcategory)


db.sequelize.sync({ alter: true, force: false })

  .then(() => {
   
    console.log("--sync done--");
  }).catch(err => {
    console.log(`error:${err}`);
  });


module.exports = db
