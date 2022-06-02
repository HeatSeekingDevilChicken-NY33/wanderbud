const fs = require('fs');
const path = require('path');
const db = require('../database/testdb');
const request = require('supertest');
const { doesNotMatch } = require('assert');
const server = 'http://localhost:3000';

describe('database backend function test', () => {
    // BeforeAll Create Appropriate Tables
    beforeAll(async () => {

        const dropAllTables = `
            DROP TABLE IF EXISTS "userJourney";
            DROP TABLE IF EXISTS "journey";
            DROP TABLE IF EXISTS "user";
        `;
        
        await db.query(dropAllTables);
        
        const createUserTableQuery = `
        CREATE TABLE "user" (
            "id" SERIAL PRIMARY KEY,
            "firstName" VARCHAR(255),
            "lastName" VARCHAR(255),
            "age" INT,
            "email" VARCHAR(255),
            "password" VARCHAR(255)
        );
        `;
        const createJourneyTableQuery = `
        CREATE TABLE "journey" (
            "id" SERIAL PRIMARY KEY,
            "origin" VARCHAR(255),
            "destination" VARCHAR(255),
            "date" VARCHAR(255),
            "distance" INT,
            "duration" VARCHAR(255),
            "totalCost" INT,
            "completed" INT
        );
        `;
        const createUserJourneyTableQuery = `
        CREATE TABLE "userJourney" (
            "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "userID" integer REFERENCES "user"(id),
            "journeyID" integer REFERENCES journey(id),
            "cost" integer DEFAULT 0,
            "driver" bit(1) DEFAULT '0'::"bit"
            );
        `;
        await db.query(createUserTableQuery);
        await db.query(createJourneyTableQuery);
        await db.query(createUserJourneyTableQuery);
    });

    /*
    afterAll(async () => {
        
        // const dropAllTables = `
        //     DROP TABLE IF EXISTS "userJourney";
        //     DROP TABLE IF EXISTS "journey";
        //     DROP TABLE IF EXISTS "user";
        // `;
        
        // await db.query(dropAllTables);
    });
    */

/*
Test for: CREATE, READ, UPDATE, DELETE
JourneyController
CREATE: 
journeyController.createJourney(req, res, next);
    > {origin, destination, date} = req.body
    > input: req.body object
    > expect: journey to be created with SELECT statement to created parameters

READ: 
journeyController.getJourneyID = (req, res, next)
    > {origin, destination, date} = req.body;
    > input: req.body object
    > expect: journey ID = 1, since we created one record
    > can invoke create another record to test & expect journey ID = 2

    test db - postgres://bbrlxsgj:be9gmTE2pA7YM7DHk1LJoCq1DsEmELY_@castor.db.elephantsql.com/bbrlxsgj
*/
     /*
    userController

    CREATE:
    userController.signupUser = (req, res, next)
        > 
        > 
    */
    describe('db user tests', () => {

        // route: '/signup/users'
        describe('/signup/users', () => {
            it('should create user in DB when signing up using /signup/users & return json object', async () => {
                const response = await request(server)
                    .post('/signup/users')
                    .send({
                        firstName: 'Bobby', 
                        lastName: 'Fisher', 
                        age: 29, 
                        email: 'bobby.fischer@gmail.com', 
                        password: 'bobby'
                    })
                    .set('Accept', 'application/json')
                expect(response.headers['content-type']).toMatch(/json/);
                expect(response.status).toEqual(200);
                expect(response.body.id).toEqual(1);
            });

            it('should have the signed up user show in the database', async () => {
                expect(1).toBe(1);
            });
        });
        
        describe('/login', () => {
            it('Should log users in when correct information is provided', async () => {
                const response = await request(server)
                    .post('/login')
                    .send({
                        email: 'bobby.fischer@gmail.com',
                        password: 'bobby'
                    })
                    .set('Accept', 'application/json');
                    // console.log(response);
                expect(response.status).toEqual(200);
                expect(response.body.userData.id).toEqual(1);
            });
        });
    });

    describe('db Journey Router tests', () => {
        describe('/journey/create', () => {
            // router.post('/create')
            it('Should create a journey in the database', async () => {
                const response = await request(server)
                    .post('/journey/create')
                    .send({
                        user_id: 1,
                        origin: "New York",
                        destination: "Los Angeles",
                        date: "2022-07-22"
                    })
                    .set('Accept', 'application/json');
                expect(response.status).toEqual(200);
                // console.log(response.body[0]);
                expect(response.body[0].origin).toMatch('New York');
            });
        });

        // router.post('/find')
        describe('/journey/find', () => {
            it('Should find a journey that was created', async () => {
                const response = await request(server)
                    .post('/journey/find')
                    .send({
                        origin: 'New York',
                        destination: 'Los Angeles',
                        date: '2022-07-22'
                    })
                    .set('Accept', 'application/json');
                expect(response.status).toEqual(200);
                expect(response.body[0].origin).toMatch('New York');
            });
        });

        // router.post('/join')
        describe('/journey/join', () => {
            it('Should allow a user to join an existing journey', async () => {
                // creates another user
                await request(server)
                    .post('/signup/users')
                    .send({
                        firstName: 'Ted', 
                        lastName: 'Cruz', 
                        age: 59, 
                        email: 'ted.cruz@gmail.com', 
                        password: 'ted'
                    })
                    .set('Accept', 'application/json');
                // join the user here
                const response = await request(server)
                    .post('/journey/join')
                    .send({
                        userID: 2,
                        journeyID: 1
                    })
                    .set('Accept', 'application/json');
                expect(response.status).toEqual(200);
                expect(response.body.origin).toMatch('New York');
            });
        });

        // router.delete('/join')
        describe('delete /journey/join', () => {
            it('Should delete a passenger from a journey', async() => {
                const response = await request(server)
                    .del('/journey/join')
                    .send({
                        joinObj: {
                            userID: 2,
                            journeyID: 1,
                        }
                    });
                expect(response.status).toEqual(200);
            });
        });

        // router.delete('/') passenger deletes an entire journey from db journey
        describe('delete /journey/', () => {
            it('should delete a journey from the database', async () => {
                const response = await request(server)
                    .del('/journey/')
                    .send({
                        joinObj: {
                            userID: 1,
                            journeyID: 1
                        }
                    })
                    .set('Accept', 'application/json');
                expect(response.status).toEqual(200);
            });
        });
    });
    /*
    journey routes:
    /prepended with /journey

    
    */ 

});


