import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../services/prisma";

export default async function profileRoutes(app: FastifyInstance) {
  app.get(
    "/profile/:username",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username } = request.params as { username: string };
      const user = await prisma.user.findUnique({
        where: { username },
        include: { links: { where: { isPublic: true } } },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      const profile = {
        username: user.username,
        name: user.name,
        description: user.description,
        userPhoto: user.imgUrl,
        links: user.links,
      };
      return reply.status(200).send(profile);
    }
  );

  app.get(
    "/me",
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user.id; // Assuming request.user is set by the authenticate hook
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { links: true },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      const profile = {
        username: user.username,
        name: user.name,
        description: user.description,
        userPhoto: user.imgUrl,
        links: user.links,
      };
      return reply.status(200).send(profile);
    }
  );

  app.put(
    "/profile",
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, name, description } = request.body as {
        username: string;
        name?: string;
        description?: string;
      };

      const userId = request.user.id;

      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { username, name, description },
        });

        return reply.status(200).send(updatedUser);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ error: "Failed to update profile" });
      }
    }
  );
}
