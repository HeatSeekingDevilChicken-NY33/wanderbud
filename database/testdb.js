const { Pool } = require('pg');

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
const PG_URI = 'postgres://bbrlxsgj:be9gmTE2pA7YM7DHk1LJoCq1DsEmELY_@castor.db.elephantsql.com/bbrlxsgj';
const pool = new Pool({connectionString: PG_URI});

module.exports = {
    query: (text, params, callback) => {
      console.log('Executed Query', text);
      return pool.query(text, params, callback);
    }
};
