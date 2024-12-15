const express = require('express')
const { verifyLogin } = require('../controller/adminController')

const router = express.Router()

router.post('/adminLogin',verifyLogin)

module.exports = router;