const { request } = require('express');
const db = require('../../database/dbConnection');

const userController = {};

// Middleware to Add New User (Signup + Login)
userController.signupUser = (req, res, next) => {

    // Check For Any Missing Fields
    const {firstName, lastName, age, email, password} = req.body;
    if (!firstName || !lastName || !age || !email || !password) {
        return next({
            'log': 'User Controller: Signup User - Missing Required Signup Information', 
            'message': {err: 'userController.signupUser: ERROR: Missing Required Signup Information'}
          });
    }

    // Email Validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return next({
            'log': 'User Controller: Signup User - Incorrect Email', 
            'message': {err: 'userController.signupUser: ERROR: Incorrect Email'}
          });
    }

    // Query - Insert New User Into Database
    const text ='INSERT INTO "user" (firstName, lastName, age, email, password) VALUES ($1, $2, $3, $4, $5);';
    const values = [firstName, lastName, age, email, password];

    db.query(text, values)
        .then(response => {
            console.log("RESPONSE ==>",response.rows)
            res.locals.userData = response.rows;
            next();
        })
        .catch(err => {
            return next({
                'log': 'User Controller: Add User - DB Query Error', 
                'message': {err: 'userController.addUser: ERROR: check server logs for details'}
              });
        })
}

// Middleware to Get User (Login)
userController.loginUser = (req, res, next) => {

    console.log('userController.verifyUser for Login');

    const {email, password} = req.body;

    if (!email || !password) {
        // res.status(403);
        return next({
            'log': 'User Controller: Login User - Missing Email or Password for Login', 
            'message': {err: 'userController.loginUser: ERROR: Missing Email or Password for Login'}
          })
    }

    const text = 'SELECT _id, firstName, lastName, age, email FROM "user" WHERE email=$1 AND password=$2;';
    const values = [email, password];

    db.query(text, values)
        .then(response => {
            res.locals.userData = response.rows[0];
            return next();
        })
        .catch(err => {
            return next({
                'log': 'Error in userController.getUser DB Query', 
                'message': {err: 'userController.getUser: ERROR: check server logs for details'}
              });
        })
}

//gets all of user's journeys
userController.userJourneys = async (req, res, next) => {
    const userID = res.locals.userData._id;
    console.log("RESPONSE ==>",res.locals);
    console.log("User ID: ",userID)

    async function userJourneys() {
        try {
                const response = await db.query(`SELECT uj.userID,j._id, j.origin, j.destination, j.date, j.completed, j.duration, j.distance, j.totalCost 
                FROM "userJourney" uj LEFT JOIN "journey" j ON j._id = uj.journeyID WHERE uj.userID = '${userID}'`);
                const journeys = await response.rows;
                res.locals.allJourneys = journeys
                return next();
            }
            catch(err) {
                console.log("Error fetching journeys...");
            }
        }
        userJourneys();
}

module.exports = userController;

