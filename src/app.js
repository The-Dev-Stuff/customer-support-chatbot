import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = 3007;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
