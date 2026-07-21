import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import db from './config/database';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    port: PORT,
    dbReadyState: db.readyState,
  });
});

app.listen(PORT, () => {
  console.log(`OctoFit backend running on port ${PORT}`);
});
