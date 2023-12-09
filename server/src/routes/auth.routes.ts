import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, updateUser } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', registerUser);
  app.post('/login', loginUser);

  app.post('/update/:id', updateUser);
}