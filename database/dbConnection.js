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
let PG_URI = 'postgres://nopyulan:WKLiI-Qx46dvnkVPu-YRJjbKuBBi9oJp@fanny.db.elephantsql.com/nopyulan';
console.log('environment variable ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'test') {
  console.log('in test env');
  PG_URI = 'postgres://bbrlxsgj:be9gmTE2pA7YM7DHk1LJoCq1DsEmELY_@castor.db.elephantsql.com/bbrlxsgj';
}

console.log(PG_URI);
const pool = new Pool({connectionString: PG_URI});

module.exports = {
    query: (text, params, callback) => {
      console.log('Executed Query', text);
      return pool.query(text, params, callback);
    }
};
