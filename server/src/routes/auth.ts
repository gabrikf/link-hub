// routes/auth.ts
import { FastifyInstance } from "fastify";
import { prisma } from "../services/prisma";
import { firebaseAdmin } from "../services/firebase";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/firebase", async (req, reply) => {
    const { idToken } = req.body as { idToken: string };
    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { email, picture } = decoded;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!email) {
        return reply.status(401).send({ error: "Invalid Firebase token" });
      }

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: decoded.id,
            email,
            username: email.split("@")[0],
            imgUrl: picture,
          },
        });
      }

      const token = app.jwt.sign({ id: user.id, email: user.email });

      return reply.send({ token, user });
    } catch (err) {
      app.log.error(err);
      return reply.status(401).send({ error: "Invalid Firebase token" });
    }
  });
}
