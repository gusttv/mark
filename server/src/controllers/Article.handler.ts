import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';
import { createArticleBody, deleteArticleBody } from '../interfaces/article.schema';

export async function createArticle(request: FastifyRequest<{ Body: createArticleBody}>, reply: FastifyReply) {
  const { title, text } = request.body;

  const newArticle = await prisma.article.create({
    data: {
      title,
      text
    }
  });

  return reply.code(202).send(newArticle);
}


export async function getAllArticles(_request: FastifyRequest, reply: FastifyReply) {
  const articles = await prisma.article.findMany();
  return reply.code(201).send(articles);
}

export async function deleteArticle(request: FastifyRequest<{ Params: deleteArticleBody}>, reply: FastifyReply) {
  const title = request.params.title;
  try {
    await prisma.article.delete({
      where: {
        title,
      }
    });
  } catch(error) {
    return reply.code(500).send(error.message);
  }
  
}