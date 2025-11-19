import express from 'express';
import cors from 'cors';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
const swaggerDocument = require('./swagger-output.json');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());

// Error Middleware
app.use(errorMiddleware);

//api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Routers
app.use('/api', router);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`=> Auth Service listening at http://localhost:${port}/api`);
  console.log(`=> API Docs available at http://localhost:${port}/docs`);
});

server.on('error', (error) => {
  console.error(`Error occurred: ${error.message}`);
});
