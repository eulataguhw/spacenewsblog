import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const connectionString = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  accelerateUrl: connectionString,
}).$extends(withAccelerate());

export default prisma;
