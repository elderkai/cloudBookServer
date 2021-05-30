const express = require('express')
const router = express.Router()
const {addBook, getBook, getBookById, getBookByType, changeBook, deleteBook} = require('../controller/book')
const auth = require('../controller/auth')
const category = require('../controller/category')
const swiper = require('../controller/swiper')
const cos = require('../controller/cos')
// const titles = require('../controller/title')
// const article = require('../controller/article')
const user = require('../controller/user')
// const collection = require('../controller/bookCollection')
// const readList = require('../controller/readList')

router.post('/book', auth, addBook)
router.get('/book', getBook)
router.get('/book/:id', getBookById)
router.put('/book', auth, changeBook)
router.delete('/book/:id', auth, deleteBook)
router.use(swiper)
router.use(user)
router.use(category)
router.use(cos)
router.get('/test', function (req, res) {
    res.send('这是测试接口')
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
module.exports = router;
