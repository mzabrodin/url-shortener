import {type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest} from 'fastify';

export function errorHandler(this: FastifyInstance, error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  const status = error.statusCode ?? 500;
  if (status >= 500) {
    this.log.error(error);
    return reply.code(500).send({error: 'Internal server error'});
  }

  return reply.code(status).send({error: error.message});
}
