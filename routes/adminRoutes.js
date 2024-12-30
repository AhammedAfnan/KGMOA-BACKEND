const express = require('express')
const { verifyLogin, getUsersCount, getTableData, changePass, addNews, getCheckedInCount, getReceivedKitCount, getNews, deleteNews, updateNews } = require('../controller/adminController')

const router = express.Router()

router.post('/adminLogin',verifyLogin)
router.get('/userCount',getUsersCount)
router.get('/table-data',getTableData)
router.post('/change-password',changePass)
router.post('/add-news',addNews)
router.get('/checkedInCount',getCheckedInCount)
router.get("/kitReceivedCount", getReceivedKitCount);
router.get('/news',getNews)
router.delete('/news/:id', deleteNews)
router.put('/news/:id',updateNews)

module.exports = router;