import { Prisma } from '@prisma/client';

import * as runtime from '@prisma/client/runtime/library';

export type ExtraFindUniqueParams<T extends Omit<Prisma.UserFindUniqueArgs, 'where'>> = Omit<Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>, 'where'>;
export type WithSnowflake<T extends Omit<Prisma.UserFindUniqueArgs, 'where'>> = ExtraFindUniqueParams<T> & {where: {snowflake: bigint}};
export type WithSnowflakeParam<T extends Omit<Prisma.UserFindUniqueArgs, 'where'>> = Prisma.SelectSubset<WithSnowflake<T>, Prisma.UserFindUniqueArgs>;
export type FindUniqueReturn<T extends Prisma.UserFindUniqueArgs> = runtime.Types.Result.GetFindResult<Prisma.$UserPayload, T, {}>

export type FindUniquePollReturn<T extends Prisma.PollFindUniqueArgs> = runtime.Types.Result.GetFindResult<Prisma.$PollPayload, T, {}>
