import jwt from 'jsonwebtoken';
import type { FastifyRequest, FastifyReply } from 'fastify';

export async function autenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>{
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) reply.code(401).send({ error: 'Missing token!'});

  const token = authorizationHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) reply.code(401).send({ error: 'Invalid token'});
    request.body['user'] = decoded;
    console.log(request.body);
  });
}