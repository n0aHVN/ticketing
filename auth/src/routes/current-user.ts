import express from 'express';

import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUser,requireAuth, (req, res) => {
  return res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };