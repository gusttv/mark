import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserBody } from '../interfaces/auth.schema';
import jwt  from 'jsonwebtoken';
import { db } from '../utils/prisma';
import { Prisma } from '@prisma/client';

export async function registerUser(
  request: FastifyRequest<{ Body: UserBody }>,
  reply: FastifyReply
) {
  const { username, password } = request.body;

  const usernameRegex = /^([a-zA-Z0-9]{3,15})$/;
  const passwordRegex = /^(?=.*[A-Z])[a-zA-Z0-9]{3,10}$/;

  const isValidUsername = usernameRegex.test(username);
  const isValidPassword = passwordRegex.test(password);

  if (!isValidUsername) {
    return reply.status(400).send({
      error: 'Username must contain only letters, numbers and must be between 3 and 15 characters.',
    });
  }

  if (!isValidPassword) {
    return reply.status(400).send({
      error: 'Password must contain at least one uppercase character and must be between 3 and 10 characters.',
    });
  }

  try {
    const user = await db.user.create({
      data: { username, password },
    });

    return reply.status(201).send(user);
  } catch (error) {
    // prisma validation error
    if (error instanceof Prisma.PrismaClientValidationError) {
      reply.code(400).send({ error: 'Invalid username or password' });
      return;
    }

    // unknown error
    console.error('Error while updating user: ', error);
    reply.code(500).send({ error: 'Failed to create user' });
  }
}


export async function loginUser(
  request: FastifyRequest<{ Body: UserBody }>, 
  reply: FastifyReply
) {

  const { username, password } = request.body;

  try {
    const user = await db.user.findUnique({
      where: { username }
    });

    if (!user || user.password !== password) {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username} , process.env.JWT_SECRET, {
      expiresIn: '10h'
    }); 
    return reply.send(token);
    
  } catch (error) {
    // prisma validation error
    if (error instanceof Prisma.PrismaClientValidationError) {
      reply.code(400).send({ error: 'Invalid username or password' });
      return;
    }

    // unknown error
    console.error('Error while updating user: ', error);
    reply.code(500).send({ error: 'Failed to login user' });
  }
}

export async function updateUser(
  request: FastifyRequest<{ Body: UserBody, Params: { id: number} }>, 
  reply: FastifyReply
) {
  const userId  = Number(request.params.id);
  const { username, password } = request.body;

  if (!username || !password) {
    reply.code(400).send({ error: 'Username and password are required for updating user.' });
    return;
  }

  try {
    const updatedUser =  await db.user.update({
      where: { id: userId },
      data: { username, password }
    });

    reply.code(201).send(updatedUser);
  } catch(error) {
    // prisma validation error
    if (error instanceof Prisma.PrismaClientValidationError) {
      reply.code(400).send({ error: 'Invalid username or password' });
      return;
    }

    // unknown error
    console.error('Error while updating user: ', error);
    reply.code(500).send({ error: 'Failed to update user' });
  }
}