const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Create a new user (signup + login)
router.post('/signup/users', 
    userController.signupUser, userController.loginUser,
    (req, res) => {
        res.status(200).json(res.locals.userData);
    });

// Log in a user (then authenticate: stretch feature) 
// router.post('/login', 
//     userController.loginUser, 
//     (req, res) => {
//         res.status(200).json(res.locals.userData);
//     });

router.post('/login', 
userController.loginUser, userController.userJourneys,
(req, res) => {
    res.status(200).json({userData: res.locals.userData, journeyData: res.locals.allJourneys});
});


module.exports = router;