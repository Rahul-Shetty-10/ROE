const express = require('express')
const router = express.Router()
const { jwt_auth, user_role_auth} = require('../middleware/auth_middleware');

const { upload } = require('../helper/uploads');

const userdashboardController = require('../controller/user_controller/user_dashboard')
const userplacementController = require('../controller/user_controller/placement')
const userprofileController = require('../controller/user_controller/profile')
const userstudentsController = require('../controller/user_controller/students')
const useraspirantsController = require('../controller/user_controller/aspirants')

router.get('/user_dashboard', jwt_auth, user_role_auth, userdashboardController.dashboard_page);

router.get('/placement', jwt_auth, userplacementController.placement_page);
router.post('/placement', upload.single('Payment_Screenshot'), userplacementController.placement);

router.get('/profile', jwt_auth, userprofileController.profile_page);
router.post('/profile', jwt_auth, userprofileController.profile);

router.get('/engineering_students', jwt_auth, userstudentsController.engineering_students_page);
router.get('/placement', jwt_auth, userstudentsController.placement_page);
router.get('/higher_study_guidance', jwt_auth, userstudentsController.higher_study_guidance_page);
router.get('/workshops', jwt_auth, userstudentsController.workshops_page);





router.get('/engineering_aspirants', jwt_auth, useraspirantsController.engineering_aspirants_page);
router.get('/entrance_exams', jwt_auth, useraspirantsController.entrance_exams_page);
router.get('/college_rankings', jwt_auth, useraspirantsController.college_rankings_page);
router.get('/explore_branches', jwt_auth, useraspirantsController.explore_branches_page);




module.exports = router