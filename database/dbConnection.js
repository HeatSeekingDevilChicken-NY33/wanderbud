const { Pool } = require('pg');
require("dotenv").config();

// Local Database - Postgres
// const credentials = {
//   user: "postgres",
//   host: "localhost",
//   database: "wanderbud",
//   password: "pass",
//   port: 5432,
// };
// const pool = new Pool(credentials);

// Remote Database - ElephantSQL
let PG_URI = `${process.env.DB_STRING}`;
console.log('environment variable ', `${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'test') {
  console.log('in test env');
  PG_URI = `${process.env.DB_STRING_TEST}`;
}
const userTable = `CREATE TABLE IF NOT EXISTS "user"(
  _id SERIAL PRIMARY KEY,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  age INTEGER NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL
  );`;
const userJourney = `CREATE TABLE IF NOT EXISTS "userJourney"(
  _id SERIAL PRIMARY KEY,
  userID INTEGER NOT NULL,
  journeyID INTEGER NOT NULL,
  userStatus VARCHAR,
  cost INTEGER,
  driver BOOLEAN
  );`
const journey = `CREATE TABLE IF NOT EXISTS "journey"(
  _id SERIAL PRIMARY KEY,
  origin VARCHAR NOT NULL,
  destination VARCHAR NOT NULL,
  date DATE NOT NULL,
  completed VARCHAR,
  distance INTEGER,
  duration INTEGER,
  totalCost INTEGER
  );`
  const pool = new Pool({connectionString: PG_URI});
  pool.query(userTable)
  pool.query(userJourney);
  pool.query(journey);

module.exports = {
    query: (text, params, callback) => {
      console.log('Executed Query', text);
      return pool.query(text, params, callback);
    }
};
