import { Router } from 'express';
import Leaderboard from '../models/leaderboard';

const router = Router();

router.get('/', async (_req, res) => {
  const leaderboard = await Leaderboard.find({})
    .populate('user', 'name totalPoints')
    .sort({ rank: 1 })
    .lean();
  res.json({
    resource: 'leaderboard',
    items: leaderboard,
  });
});

export default router;
