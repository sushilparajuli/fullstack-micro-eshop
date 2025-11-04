import express from 'express';
import cors from 'cors';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`=> Auth Service listening at http://localhost:${port}/api`);
});

server.on('error', (error) => {
  console.error(`Error occurred: ${error.message}`);
});
