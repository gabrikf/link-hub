import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }

  interface FastifyRequest {
    user: {
      id: string;
      [key: string]: any;
    };
  }
}
// types/fastify.d.ts
import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string }; // whatever you're signing
    user: { id: string; email: string };
  }
}
