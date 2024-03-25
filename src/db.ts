import { Prisma, PrismaClient } from '@prisma/client';

if (typeof window !== 'undefined') throw new Error('Cannot connect to the database from the client!');

if (!process.env.DATABASE_URL) throw new Error('No DATABASE_URL env var');

declare global {
    var db____internal: undefined | ReturnType<typeof newPrismaClientBase> | Awaited<ReturnType<typeof newPrismaClientBase>>;
}

function newPrismaClient() {
    if (globalThis.db____internal !== undefined) return globalThis.db____internal;
    return globalThis.db____internal = newPrismaClientBase();
}

function newPrismaClientBase() {
    const db = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
        errorFormat: 'pretty',
    })
    .$extends({
        name: 'Community Masterlist Custom Search Extension',
    });
    ;

    db.$connect();
    process.on('exit', () => db.$disconnect());

    return db;
}

export const db = newPrismaClient();
export default db;
