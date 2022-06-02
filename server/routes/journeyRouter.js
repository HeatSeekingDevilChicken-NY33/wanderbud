const express = require('express');
const journeyController = require('../controllers/journeyController');
const router = express.Router();
const userController = require('../controllers/userController');

// Driver Creates a Journey
router.post('/create', journeyController.createJourney, journeyController.getJourneyID,
journeyController.createUserJourney, journeyController.getfirstName, journeyController.getJourney, (req, res) => {
    res.status(200).json(res.locals.journey);
}); 
// NEV: BEFORE GETTIN DATA FROM DB, "UpdateEntry" will make update in DB for completion status
// User searches for a Journey
router.post('/find', journeyController.updateEntry,journeyController.getEntry, (req, res) => {
    res.status(200).json(res.locals.journey);
});

// Passenger Joins a Journey
router.post('/join', journeyController.join, journeyController.createUserJourney, (req, res) => {
    res.status(200).json(res.locals.join);
});

// Passenger Removes themselves from a journey
router.delete('/join', journeyController.unjoin, (req, res) => {
    res.sendStatus(200);
}); 

/* // Update after a journey is completed
router.patch('/', journeyController.updateEntry, journeyController.getUpdatedJourneyID, 
journeyController.totalPeople, journeyController.updateUserJourney, (req, res) => {
    res.status(200).json(res.locals.updated);
}); */

// Driver deletes a Journey
// router.delete('/', journeyController.unjoin, journeyController.deleteEntry, 
// journeyController.getJourney, (req, res) => {
//     res.status(200).json(res.locals.delete);
// }); 

router.delete('/', journeyController.unjoin, journeyController.deleteEntry, (req, res) => {
    res.status(200).json(res.locals.delete);
}); 

module.exports = router;

