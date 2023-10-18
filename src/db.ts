import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) throw new Error('No DATABASE_URL env var');

const db = new PrismaClient();
await db.$connect();
export default db;

process.on('exit', () => db.$disconnect());
