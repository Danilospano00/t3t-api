import dotenv from 'dotenv';
import * as os from 'os';
import { createApp } from './app';
import cluster from 'cluster';
import {
  applyPendingMigrations,
  initializeDatabaseConnection,
} from './config/database_config';

/**
 * Defining environment
 * Load environment variables and begin the server initialization process.
 */
// Load environment variables from .env file
dotenv.config();

/**
 * Server Initialization
 * This function initializes the database connection, starts the Express app,
 * applies database migrations, and handles server operations such as migrations, graceful shutdown, and error logging.
 */
async function initializeAndStartServer() {
  // Init the db connection
  await initializeDatabaseConnection();

  // // Create and start the Express app
  const app = await createApp();
  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // if (process.env.NODE_ENV !== 'development') {
  //   // Pause for 5 seconds to ensure the connection with the DB (required for AWS)
  //   await sleep(5000);
  // }

  // // Apply pending database migrations
  await applyPendingMigrations();

  // Init Express
  app.listen(port, () => {
    // Log server startup information
    console.log(
      `🚀  Worker ${process.pid}: Application started in ${process.env.NODE_ENV} mode, listening on port ${port}`,
    );
  });
}

/**
 * Cluster Setup
 * Configures the clustering of workers for multi-core usage. In production, the master process forks a worker for each available CPU core.
 */
if (process.env.NODE_ENV !== 'development' && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(
    `🟢  Master ${process.pid} running. Starting ${numCPUs} worker(s)...`,
  );

  // Fork a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker crashes and restart them
  cluster.on('exit', (worker, _code, _signal) => {
    console.error(
      `🔴  Worker ${worker.process.pid} terminated. Restarting the worker...`,
    );
    cluster.fork(); // Fork a new worker
  });
} else {
  // Executes the server startup logic in worker processes. Each worker starts the Express server.
  const startServerInWorker = async (): Promise<void> => {
    try {
      await initializeAndStartServer();
    } catch (error) {
      console.error('🔴  Error starting the server:', error);
      process.exit(1);
    }
  };

  // Start the server in the worker process
  startServerInWorker();
}
