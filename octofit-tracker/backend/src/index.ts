import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { apiBaseUrl } from './config/apiBaseUrl';
import db from './config/database';
import usersRouter from './routes/users';
import teamsRouter from './routes/teams';
import activitiesRouter from './routes/activities';
import leaderboardRouter from './routes/leaderboard';
import workoutsRouter from './routes/workouts';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    port: PORT,
    apiBaseUrl,
    dbReadyState: db.readyState,
  });
});

app.listen(PORT, () => {
  console.log(`OctoFit backend running on port ${PORT}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});
