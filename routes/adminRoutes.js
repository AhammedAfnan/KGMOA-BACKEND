const express = require('express')
const { verifyLogin, getUsersCount, getTableData, changePass } = require('../controller/adminController')

const router = express.Router()

router.post('/adminLogin',verifyLogin)
router.get('/userCount',getUsersCount)
router.get('/table-data',getTableData)
router.post('/change-password',changePass)

module.exports = router;