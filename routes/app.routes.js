const client = require('./client/client.router')
const bill = require('./bill/bill.routes')
const date = require('./date/date.routes')
const month = require('./month/month.routes')
const admin = require('./Admin/admin.router')
const purchase = require('./Purchase/purchase.router')
const sale = require('./sales/sale.router')
const company = require('./Company/company.router')
const vat = require('./vat/vat.router')
const vendor = require('./vendor/vendor.router')
    
function createRoutesNoAuth(app) {
    app.use('/api', admin,)
}
function createRoutes(app) {
    app.use('/api', client, bill, date, month,admin,purchase,sale,company,vat,vendor)
}


module.exports = {
    createRoutes: createRoutes,
    createRoutesNoAuth: createRoutesNoAuth
}