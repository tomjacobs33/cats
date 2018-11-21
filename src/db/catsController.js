import mysql from 'mysql';
import { con } from './cats';
// import logger from '../logger';

// find cat based on given criteria
const find = async queryObj => {
  console.log('Entering find query');
  const id = queryObj.id ? mysql.escape(queryObj.id) : null;
  const name = queryObj.name ? mysql.escape(queryObj.name) : null;
  const username = queryObj.username ? mysql.escape(queryObj.username) : null;
  return new Promise((resolve, reject) => {
    let sql = `SELECT birthdate, breed, username, id, imageUrl, name FROM catss `;
    if (id || name || username) {
      sql += 'WHERE ';
      if (id) {
        sql += `id = ${id} AND `;
      }
      if (name) {
        sql += `name = ${name} AND `;
      }
      if (username) {
        sql += `username = ${username} AND `;
      }
      // remove the AND clause that we put at the end
      sql = sql.substring(0, sql.length - 4);
    }
    sql += 'ORDER BY lastSeenAt';
    console.log(`Find SQL Statement: ${sql}`);
    con.query(sql, (err, result) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(result);
      }
    });
  });
};

const login = async username => {
  console.log('Entering login query');
  return new Promise((resolve, reject) => {
    const sql = `SELECT username, password FROM catss WHERE username = '${username}'`;

    con.query(sql, (err, result) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(result[0]);
      }
    });
  });
};

const random = async () => {
  console.log('Entering random query');
  return new Promise((resolve, reject) => {
    const sql = 'SELECT breed, imageUrl, name FROM catss';

    con.query(sql, (err, result) => {
      if (err) {
        reject(new Error(err));
      } else {
        const maxIndex = result.length; // don't need to subtract 1 since we use floor in next line
        const randInt = Math.floor(Math.random() * maxIndex);
        resolve(result[randInt]);
      }
    });
  });
};

const save = async newCat => {
  console.log('Entering save query');
  const {
    addedAt,
    breed,
    birthdate,
    imageUrl,
    lastSeenAt,
    name,
    password,
    username,
    weight,
  } = newCat;
  return new Promise((resolve, reject) => {
    const sql =
      `${'INSERT INTO catss (addedAt, breed, birthdate, imageUrl, lastSeenAt, name, password, username, weight) VALUES (' +
        "'"}${addedAt}', ` +
      `'${breed}', ` +
      `'${birthdate}', ` +
      `'${imageUrl}', ` +
      `'${lastSeenAt}', ` +
      `'${name}', ` +
      `'${password}', ` +
      `'${username}', ` +
      `'${weight}'` +
      `)`;
    console.log(`Save SQL Statement: ${sql}`);
    con.query(sql, (err, result) => {
      if (err) {
        reject(new Error(err));
      } else {
        console.log('Added cat to database!');
        resolve(result);
      }
    });
  });
};

const update = updatedCat => {
  console.log('Entering update query');
  const { username, lastSeenAt } = updatedCat;
  return new Promise((resolve, reject) => {
    const sql = `UPDATE catss SET lastSeenAt = '${lastSeenAt}' WHERE username = '${username}'`;
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { find, login, random, save, update };
