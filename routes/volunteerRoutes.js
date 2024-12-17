const express = require('express');
const { verifyVolunteerLogin } = require('../controller/volunteerController');


const router = express.Router()


router.post('/volunteerLogin',verifyVolunteerLogin)

module.exports = router;