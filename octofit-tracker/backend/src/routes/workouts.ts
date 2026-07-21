import { Router } from 'express';
import Workout from '../models/workout';

const router = Router();

router.get('/', async (_req, res) => {
  const workouts = await Workout.find({})
    .populate('user', 'name email')
    .sort({ scheduledFor: 1 })
    .lean();
  res.json({
    resource: 'workouts',
    items: workouts,
  });
});

export default router;
