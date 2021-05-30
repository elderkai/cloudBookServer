var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// 116.62.145.106
mongoose.connect('mongodb://localhost/getBook', {useNewUrlParser: true});
var db = mongoose.connection;
db.once("open",() => {
    console.log("数据库连接成功")
})

module.exports = db

