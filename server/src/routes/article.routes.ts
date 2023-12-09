import type { FastifyInstance } from 'fastify';
import { createArticle, deleteArticle, getAllArticles } from '../controllers/Article.handler';

export async function articleRoutes(app: FastifyInstance) {
  app.post('/', createArticle);

  app.get('/', getAllArticles);

  app.delete('/:title', deleteArticle);
}