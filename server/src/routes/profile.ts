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
        userPhoto: user.imgUrl,
        links: user.links,
      };
      return reply.status(200).send(profile);
    }
  );
}
