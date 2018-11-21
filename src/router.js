import { Router } from 'express';
import { register } from './routes/cat';
import { findCats, randomCat } from './routes/cats';

const router = new Router();

// Register your routes and middleware to handle them here!!
const defaultEndpoint = (req, res) => {
  res.send(`Your NodeJS server is running`);
};

router.get(`/`, defaultEndpoint);

router.get('/cats/random', randomCat);

router.post('/cat/register', register);

router.post('/cats', findCats);

export default router;
