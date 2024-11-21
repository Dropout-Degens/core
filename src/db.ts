import { PrismaClient } from '@prisma/client';



declare global {
    var db____internal: undefined | ReturnType<typeof newPrismaClientBase> | Awaited<ReturnType<typeof newPrismaClientBase>>;
}

function newPrismaClient(): ReturnType<typeof newPrismaClientBase> {
    if (typeof window !== 'undefined') {
        return new Proxy({}, {
            get() {
                throw new Error('Cannot connect to the database from the client!');
            }
        }) as any;
    }

    if (!process.env.DATABASE_URL) throw new Error('No DATABASE_URL env var');

    if (globalThis.db____internal !== undefined) return globalThis.db____internal;
    return globalThis.db____internal = newPrismaClientBase();
}

function newPrismaClientBase() {
    const db = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
        errorFormat: 'pretty',
    });

    db.$connect();
    process.on('exit', () => db.$disconnect());

    return db;
}

export const db = newPrismaClient();
export default db;
