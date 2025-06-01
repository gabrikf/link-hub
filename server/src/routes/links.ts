import { FastifyInstance, FastifyReply } from "fastify";
import { prisma } from "../services/prisma";

export default async function linksRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  app.get("/links", async (request: any) => {
    const userId = request.user.id;
    const links = await prisma.link.findMany({ where: { userId } });
    return links;
  });

  app.get("/links/:id", async (request: any, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      reply.status(404).send({ error: "Link not found" });
    }
    return link;
  });

  app.post("/links", async (request: any, reply: FastifyReply) => {
    const userId = request.user.id;
    const { title, url, isPublic } = request.body as {
      title: string;
      url: string;
      isPublic: boolean;
    };
    if (!title || !url) {
      return reply.status(400).send({ error: "Missing title or url" });
    }
    const lastLink = await prisma.link.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });
    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    const nextOrder = lastLink?.order != null ? lastLink.order + 1 : 0;
    const link = await prisma.link.create({
      data: { title, url, userId, isPublic, order: nextOrder },
    });
    return link;
  });

  app.put("/links/:id", async (request: any) => {
    const { id } = request.params as { id: string };
    const { title, url, isPublic } = request.body as {
      title: string;
      url: string;
      isPublic: boolean;
    };
    const updated = await prisma.link.update({
      where: { id },
      data: { title, url, isPublic },
    });
    return updated;
  });

  app.delete("/links/:id", async (request: any) => {
    const { id } = request.params as { id: string };
    await prisma.link.delete({ where: { id } });
    return { success: true };
  });

  app.patch(
    "/links/reorder",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { linkIds } = request.body as { linkIds: string[] };
      const userId = request.user.id;

      if (!Array.isArray(linkIds)) {
        return reply
          .status(400)
          .send({ error: "linkIds must be an array of IDs" });
      }

      // Fetch all user's link IDs to ensure they're only reordering their own links
      const userLinks = await prisma.link.findMany({
        where: { userId },
        select: { id: true },
      });

      const validIds = new Set(userLinks.map((link) => link.id));

      // Ensure all IDs belong to the user
      const isValid = linkIds.every((id) => validIds.has(id));
      if (!isValid) {
        return reply.status(403).send({ error: "Invalid link IDs" });
      }

      // Perform batch update using Promise.all
      await Promise.all(
        linkIds.map((id, index) =>
          prisma.link.update({
            where: { id },
            data: { order: index },
          })
        )
      );

      return reply.send({ success: true });
    }
  );
  app.patch(
    "/links/:id/visibility",
    async (request: any, reply: FastifyReply) => {
      const userId = request.user.id;
      const { id } = request.params as { id: string };
      const { isPublic } = request.body as { isPublic: boolean };

      if (typeof isPublic !== "boolean") {
        return reply.status(400).send({ error: "isVisible must be a boolean" });
      }

      // Verify the link belongs to the user
      const link = await prisma.link.findFirst({ where: { id, userId } });
      if (!link) {
        return reply
          .status(404)
          .send({ error: "Link not found or access denied" });
      }

      // Update only the isVisible field
      const updatedLink = await prisma.link.update({
        where: { id },
        data: { isPublic },
      });

      return updatedLink;
    }
  );
}
