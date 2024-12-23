const express = require('express')
const { verifyLogin, getUsersCount, getTableData, changePass, addNews, getCheckedInCount, getReceivedKitCount } = require('../controller/adminController')

const router = express.Router()

router.post('/adminLogin',verifyLogin)
router.get('/userCount',getUsersCount)
router.get('/table-data',getTableData)
router.post('/change-password',changePass)
router.post('/add-news',addNews)
router.get('/checkedInCount',getCheckedInCount)
router.get("/kitReceivedCount", getReceivedKitCount);

module.exports = router;