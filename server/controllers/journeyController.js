const { request } = require('express');
const db = require('../../database/dbConnection');
const { use } = require('../routes/journeyRouter');

const journeyController = {};

// Creates a Journey
// Recieves origin, destination, date, driver, userID from Front End
journeyController.createJourney = (req, res, next) => {
    const {origin, destination, date} = req.body;

    // create a instance in journey table: origin, destination, date, distance=0, totalCost=0, completed=0
    const query = `INSERT INTO "journey" ("origin", "destination", "date") VALUES ('${origin}', '${destination}', '${date}')`
    db.query(query)
    .then(res => {
        return next();
    })
    .catch(err => {
        console.log("Error creating Journey...");
    })
}

// Get JourneyID of journey just created
journeyController.getJourneyID = (req, res, next) => {
    const {origin, destination, date} = req.body;
    let journeyID;

    async function gettingID() {
        try {
            // get id of journey just created 
            const response = await db.query(`SELECT "id" FROM "journey" WHERE "origin"='${origin}' AND "destination"='${destination}' AND "date"='${date}'`)
            journeyID = await response.rows[0].id;
            console.log("Journey ID:", journeyID);
            res.locals.journeyID = journeyID;
            res.locals.driver = 1;
            return next(); 
        }
        catch(err) {
            console.log("Error selecting JourneyID...");
        }
    }
    gettingID();
}

// Create instance in User Journey Table (when we create a journey vs join journey)
journeyController.createUserJourney = (req, res, next) => {
    const {user_id} = req.body
    const driver = res.locals.driver
    const journey_id = res.locals.journeyID
    console.log(driver,user_id, journey_id);

    // create a instance in userJourney table: userID, journeyID, cost=0, driver 
    if (driver === 1 && user_id != undefined) {
        const query = `INSERT INTO "userJourney" ("userID","journeyID","driver") VALUES (${user_id},${journey_id},'${driver}');`
        db.query(query)
        .then(res => {
            return next();
        })
        .catch(err => {
            console.log("Error creating UserJourney...");
        })  
    }
    else {
        const query = `INSERT INTO "userJourney" ("userID","journeyID","driver") VALUES (${res.locals.sendUserID},${journey_id},'0');`
        db.query(query)
        .then(res => {
            return next();
        })
        .catch(err => {
            console.log("Error creating UserJourney...");
        })  
    }
}

// Get firstName from User ID
journeyController.getfirstName = (req, res, next) => {
    const {user_id} = req.body;

    async function getName() {
        try {
            const response = await db.query(`SELECT "firstName" FROM "user" WHERE "id"=${user_id}`)
            firstN = await response.rows[0].firstName;
            res.locals.firstN = firstN;
            return next(); 
        }
        catch(err) {
            console.log("Error finding first name...");
        }
    }
    getName();
}

// send back created journey that was just created: 
// journeyID, origin, destination, date, creatorObject {userID, firstName}, distance
journeyController.getJourney = (req, res, next) => {
    const {origin, destination, date, user_id} = req.body;
    console.log("First Name here too!",res.locals.firstN)
    
    async function getJourney() {
        try {
            const response = await db.query(`SELECT * FROM "journey" WHERE "origin"='${origin}' AND "destination"='${destination}' AND "date"='${date}'`)
            foundJourney = await response.rows;
            let creator = {user_id:user_id, firstName:res.locals.firstN}
            let journey = {'journey_id':foundJourney[0].id, 'origin':foundJourney[0].origin, 'destination':foundJourney[0].destination, 
            'date':foundJourney[0].date.toString().slice(0, 10), 'creator':creator, 'distance':foundJourney[0].distance}
            let result = [journey]
            res.locals.journey = result
            return next();
        }
        catch(err) {
            console.log("Error can not find journey...");
        }
    }
    
    getJourney();
}

// send back journeys that match origin, destination and date
// array of objects, each object includes: journeyID, origin, destination, date, distance
journeyController.getEntry = (req, res, next) => {
    const {origin, destination, date} = req.body;
    console.log('request items', origin)
    async function getJourney() {
        try {
            const response = await db.query(`
            SELECT * FROM (SELECT j.*, uj."userID", u."firstName", u."lastName"
            FROM "journey" j 
            FULL JOIN "userJourney" uj
            ON j."id" = uj."journeyID"
            FULL JOIN "user" u
            ON uj."userID" = u."id"
            WHERE uj."userID" IS NOT NULL) AS A
            WHERE A."origin"='${origin}' and A."destination"='${destination}' and A."date"='${date}'`);

            foundJourney = await response.rows;
            // Completion status should be sent in the response body
            let result = [];
            for (let i = 0; i < foundJourney.length; i++) {
                // NEV: Backend will send "completed" too as 0 or 1, frontend will revise the journey status

                    let creator = {user_id:foundJourney[i].userID, firstName:foundJourney[i].firstName}
                    let journey = {'journey_id':foundJourney[i].id, 'origin':foundJourney[i].origin, 'destination':foundJourney[i].destination, 
                    'date':foundJourney[i].date.toString().slice(0, 10), 'creator':creator, 'distance':foundJourney[i].distance, 'completed':foundJourney[i].completed }
                    result.push(journey)

                
            }
            res.locals.journey = result;
            return next();
        }
        catch(err) {
            console.log("Error can not find journey...");
        }
    }
    
    getJourney();
}

 // Error Handling, what if user has already joined?
journeyController.join = (req, res, next) => {

    const {userID, journeyID} = req.body;
    console.log(req.body)
    async function userJourney() {
        try {
                const response = await db.query(`SELECT * FROM "journey" WHERE "id"=${journeyID}`);
                const joinedJourney = await response.rows[0];
                res.locals.sendUserID = userID;
                res.locals.journeyID = journeyID;
                res.locals.join = {...joinedJourney, date: joinedJourney.date.toString().slice(0, 10)}
                return next();
            }
            catch(err) {
                console.log("Error in creating/joining userJourney instance...");
            }
        }
    
        userJourney();
}

// remove passenger/driver from userJourney with journeyID and userID
journeyController.unjoin = (req, res, next) => {
    const {userID, journeyID} = req.body.joinObj;
    console.log(req.body.joinObj)

    let query = `DELETE FROM "userJourney" WHERE "userID"=${userID} AND "journeyID"=${journeyID}`
    db.query(query)
    .then(res => {
       return next();
    })
    .catch(err => {
        console.log("Error can't remove join..");
    }) 
}

// deletes journey that driver created
journeyController.deleteEntry = (req, res, next) => {
    const {journeyID} = req.body.joinObj;
    console.log(journeyID);

    let query = `DELETE FROM "journey" WHERE "id"=${journeyID}`
    db.query(query)
    .then(res => {
       return next();
    })
    .catch(err => {
        console.log("Error can't delete journey..");
    }) 
}
 // NEV: This part is revised, based on date, it will update the completion status of journeys. 

 // Update after a journey is completed
// NEED TO calculate distance, calculate totalCost after completing a journey
journeyController.updateEntry = (req, res, next) => {
    const {origin, destination, date} = req.body
    // let query = `UPDATE Journey
    // SET "distance" = 50, "totalCost" = 600, "completed"='1'
    // WHERE "origin"='${origin}' AND "destination"='${destination}' AND "date"='${date}';`
    console.log('JOURNEY STATUS IS UPDATED!')
    let query = `UPDATE JOURNEY
    SET "completed" = '1'
    WHERE "date"<'${formatDate(new Date().toString().slice(0, 10))}'`
    db.query(query)
    .then(res => {
        return next();
    })
    .catch(err => {
        console.log("Error updating Journey...");
    })
}
/*
//Select journey id 
journeyController.getUpdatedJourneyID = (req, res, next) => {
    const {origin, destination, date} = req.body;

        async function getID() {
            try {
                    let query = `SELECT "id" FROM "journey"
                    WHERE "origin"='${origin}' AND "destination"='${destination}' AND "date"='${date}'`
                    const response = await db.query(query)
                    res.locals.journeyID = response.rows[0].id;
                    return next();
            }
            catch(err) {
                console.log("Error - Can't locate journey ID");
            }
        }
        getID();
}

// find total number of people on journey 
journeyController.totalPeople = (req, res, next) => {
    async function getTotal() {
        try {
                let query = `SELECT u."userID", u."userStatus", j."totalCost" FROM "userJourney" u 
                LEFT JOIN "journey" j ON j."id"=u."journeyID"
                WHERE "journeyID"=${res.locals.journeyID}`
                const response = await db.query(query)
                const array = response.rows;
                let arrayID = [];
                for (let i = 0; i < array.length; i++) {
                    arrayID.push(array[i].userID);
                }
                res.locals.individualCost = (response.rows[0].totalCost)/array.length;
                res.locals.people = arrayID;
                return next();
        }
        catch(err) {
            console.log("Error - Can't find journey members");
        }
    }
    getTotal();
    
}

// Update userJourney table after a journey is completed
// Individual journey cost after completing a journey
journeyController.updateUserJourney = (req, res, next) => {
    console.log("made it: individual cost to update: ",res.locals.individualCost, "for UserID:", res.locals.people);

    for (let i = 0; i < res.locals.people.length; i++) {
        db.query(`UPDATE "userJourney" SET "cost"=${res.locals.individualCost} WHERE "userID"='${res.locals.people[i]}'`)
        .catch(err => {
            console.log("Cant update individual cost for journey...");
        })
    }

    res.locals.updated = "Successfully updated";
    return next();
}


journeyController.getID = (req, res, next) => {
    const {origin, destination, date, email} = req.body;

    async function selectID() {
        try {
                let query = `SELECT j."journeyID", u."id" FROM "userJourney" j
                LEFT JOIN "user" u ON j."userID" = u."id"
                LEFT JOIN "journey" r ON "journeyID" = r."id"
                WHERE u."email" = '${email}' AND r."origin"='${origin}' AND r."destination"='${destination}' AND r."date"='${date}'`
                const response = await db.query(query)
                res.locals.journeyID = response.rows[0].journeyID;
                res.locals.userID = response.rows[0].id;
                return next();
        }
        catch(err) {
            console.log("Error - Can't locate journey ID");
        }
    }
    selectID();
}
 */

// NEV: This one is to format the date yyyy-mm-dd, is used in updated entry
const formatDate = (date) => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear()+21;
    return [year, month, day].join('-');
  }

module.exports = journeyController;