import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) throw new Error('No DATABASE_URL env var');

export const db = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
});
await db.$connect();
export default db;

process.on('exit', () => db.$disconnect());
