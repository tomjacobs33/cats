// import logger from '../logger';
import { find, random } from '../db/catsController';

const findCats = async (req, res) => {
  console.log('Entering findCats function');
  const queryObj = req.body;

  try {
    const result = await find(queryObj);
    if (result.length === 0) {
      throw new Error('Unable to find any cats!');
    } else {
      res.send(result);
    }
  } catch (err) {
    console.log(`Find Cats Error: ${err}`);
    res.status(400).send(`Find Cats Error: ${err}`);
  }
};

const randomCat = async (req, res) => {
  console.log('Entering randomCat function');
  try {
    const result = await random();
    res.send(result);
  } catch (err) {
    console.log(`Random Cat error: ${err}`);
    res.status(400).send(`Random Cat error: ${err}`);
  }
};

module.exports = { findCats, randomCat };
