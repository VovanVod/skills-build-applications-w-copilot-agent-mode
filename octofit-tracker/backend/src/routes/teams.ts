import { Router } from 'express';
import Team from '../models/team';

const router = Router();

router.get('/', async (_req, res) => {
  const teams = await Team.find({}).populate('members', 'name email totalPoints').lean();
  res.json({
    resource: 'teams',
    items: teams,
  });
});

export default router;
