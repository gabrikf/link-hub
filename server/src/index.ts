// index.ts
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors, { fastifyCors } from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import linksRoutes from "./routes/links";
import profileRoutes from "./routes/profile";

dotenv.config();

export const app = Fastify();

// Enable CORS for frontend
app.register(fastifyCors, {
  origin: true,
  methods: ["*"],
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

app.decorate(
  "authenticate",
  async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

// Register routes
app.register(authRoutes, { prefix: "/auth" });
app.register(linksRoutes);
app.register(profileRoutes);

// Health check
app.get("/", async () => {
  return { status: "API is running 🚀" };
});

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
