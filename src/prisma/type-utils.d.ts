import { Prisma } from '@prisma/client';

import * as runtime from '@prisma/client/runtime/library.js';
import $Result = runtime.Types.Result

export type ExtraFindUniqueParams<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = Omit<Prisma.SelectSubset<T, Prisma.userFindUniqueArgs>, 'where'>;
export type WithSnowflake<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = ExtraFindUniqueParams<T> & {where: {snowflake: bigint}};
export type WithSnowflakeParam<T extends Omit<Prisma.userFindUniqueArgs, 'where'>> = Prisma.SelectSubset<WithSnowflake<T>, Prisma.userFindUniqueArgs>;
export type FindUniqueReturn<T extends Prisma.userFindUniqueArgs> = $Result.GetFindResult<Prisma.$userPayload, T>
