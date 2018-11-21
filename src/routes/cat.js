// import logger from '../logger';
import { save } from '../db/catsController';

const register = async (req, res) => {
  console.log('Entering register function');
  const {
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight,
  } = req.body;

  const now = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const newCat = {
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight,
    addedAt: now,
    lastSeenAt: now,
  };

  try {
    if (!name) {
      throw new Error('No name given!');
    } else if (typeof username !== 'string') {
      throw new Error('Username is not a string!');
    } else if (password.length < 8) {
      throw new Error('Password is not long enough!');
    } else {
      try {
        await save(newCat);
        console.log('Register: save completed');
        res.sendStatus(200);
      } catch (err) {
        throw new Error(err);
      }
    }
  } catch (error) {
    console.log(`Register Error: ${error}`);
    res.status(400).send(`Register Error: ${error}`);
  }
};

module.exports = { register };
