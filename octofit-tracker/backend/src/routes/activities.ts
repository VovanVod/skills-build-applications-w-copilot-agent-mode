import { Router } from 'express';
import Activity from '../models/activity';

const router = Router();

router.get('/', async (_req, res) => {
  const activities = await Activity.find({}).populate('user', 'name email').sort({ date: -1 }).lean();
  res.json({
    resource: 'activities',
    items: activities,
  });
});

export default router;
