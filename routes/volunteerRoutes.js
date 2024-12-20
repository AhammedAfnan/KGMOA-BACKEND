const express = require('express');
const { verifyVolunteerLogin, saveMealPlan, getMealPlan } = require('../controller/volunteerController');


const router = express.Router()


router.post('/volunteerLogin',verifyVolunteerLogin)
router.get('/get-meal-plan',getMealPlan)
router.post('/save-meal-plan',saveMealPlan)

module.exports = router;