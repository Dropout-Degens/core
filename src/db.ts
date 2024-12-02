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

    if (!process.env.DATABASE_URL) {
        queueMicrotask(()=>{
            throw new Error('Could not connect to database because we are missing the DATABASE_URL env var');
        });

        return new Proxy({}, {
            get() {
                return ()=>{}
            }
        }) as any;
    }

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
