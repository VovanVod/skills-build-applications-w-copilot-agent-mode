import 'dotenv/config';
import { app, PORT, apiBaseUrl } from './server';

app.listen(PORT, () => {
  console.log(`OctoFit backend running on port ${PORT}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});
