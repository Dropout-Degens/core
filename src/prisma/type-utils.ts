import { Prisma } from '@prisma/client';

import * as runtime from '@prisma/client/runtime/library';

export type ExtraFindUniqueParams<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = Omit<Prisma.SelectSubset<T, Prisma.userFindUniqueArgs>, 'where'>;
export type WithSnowflake<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = ExtraFindUniqueParams<T> & {where: {snowflake: bigint}};
export type WithSnowflakeParam<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = Prisma.SelectSubset<WithSnowflake<T>, Prisma.userFindUniqueArgs>;
export type FindUniqueReturn<T extends Prisma.userFindUniqueArgs> = runtime.Types.Result.GetFindResult<Prisma.$userPayload, T, {}>

export type FindUniquePollReturn<T extends Prisma.pollFindUniqueArgs> = runtime.Types.Result.GetFindResult<Prisma.$pollPayload, T, {}>
