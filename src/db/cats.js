import mysql from 'mysql';
// import logger from '../logger';

const conCreds = {
  user: process.env.RDS_USERNAME || 'user',
  password: process.env.RDS_PASSWORD || 'password',
  host: process.env.RDS_HOSTNAME || '172.31.1.23',
  database: process.env.RDS_DB_NAME || 'ebdb',
};

const con = mysql.createConnection(conCreds);

con.connect(connectErr => {
  console.log(`Trying to connect to db: ${conCreds.database}`);
  if (connectErr) throw connectErr;
  console.log('Connected!');
  const sql =
    'CREATE TABLE IF NOT EXISTS catss (id INT AUTO_INCREMENT PRIMARY KEY, ' +
    'addedAt DATETIME(3), ' +
    'breed VARCHAR(255), ' +
    'birthdate DATE, ' +
    'imageUrl VARCHAR(255), ' +
    'lastSeenAt DATETIME(3), ' +
    'name VARCHAR(255), ' +
    'password VARCHAR(255), ' +
    'username VARCHAR(255), ' +
    'weight FLOAT(7,4))';
  console.log(`SQL Statement: ${sql}`);
  con.query(sql, queryErr => {
    if (queryErr) throw queryErr;
    console.log('Table created');
  });
});

module.exports = { con };
