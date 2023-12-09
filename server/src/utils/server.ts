import fastify from 'fastify';
import { logger } from './logger';
import cors from '@fastify/cors';
import { articleRoutes } from '../routes/article.routes';
import { authRoutes } from '../routes/auth.routes';

export async function server() {
  const app = fastify({
    logger,
  });

  await app.register(cors, {
    origin: 'http://localhost:5173'
  });
  
  app.register(articleRoutes, { prefix: '/api/article'});
  app.register(authRoutes, { prefix: '/api/auth'});

  process.on('SIGINT', async () => {
    try {
      await app.close();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });


  return app;
}