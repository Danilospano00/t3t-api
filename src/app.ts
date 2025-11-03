import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import RegisterSchema from './models/user';
import User from './models/seq.user';
import TestSchema from './models/test/test';
import Test from './models/test/seq.test';

export async function createApp(): Promise<Application> {
  const app = express();

  /**
   * * Middleware
   */

  // Set security-related HTTP headers
  app.use(helmet());

  // Configure CORS to restrict access based on origin
  app.use(cors());

  // Enable response compression for improved performance
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * * Routes
   */

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.post('/test', async (_req, res) => {
    console.log('Test data received:', _req.body);
    const parsedModel = TestSchema.safeParse(_req.body);
    const newObj = await Test.create(parsedModel.data);
    console.log('Test inserted with ID:', newObj);
    res.status(200).json({ message: 'Test data received successfully' });
  });

  app.post('/register', async (_req, res) => {
    const parsedModel = RegisterSchema.safeParse(_req.body);
    if (parsedModel.success) {
      console.log('Registration data received:', parsedModel.data);

      try {
        const newObj = await User.create(parsedModel.data);

        console.log('User inserted with ID:', newObj);
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Error inserting user into database:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      console.error('Invalid registration data:', parsedModel.error);
      res.status(400).json({
        error: 'Invalid registration data',
        details: parsedModel.error,
      });
    }
  });

  // 404 error handler
  app.use((_req, res) => {
    // => HTTP 404
    res.status(404).json({ massage: 'Route not found' });
  });

  return app;
}
