import { Prisma, membership, user } from '@prisma/client';

export * from './flatten.js'


type UserWithMembership = user & { memberships: membership[] };
