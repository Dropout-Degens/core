import db from "../db";

export async function getSelectableAgeRanges(): Promise<[minAge: number, maxAge: number | null][]> {
	const relevantData_ = await db.partnerPromo.findMany({
		where: {
			minimumAgeGTE: {not: null},
			isActive: true,
		},
		distinct: ['minimumAgeGTE'],
		select: {
			minimumAgeGTE: true,
		},
	});

	const relevantData = relevantData_ as typeof relevantData_ extends (infer T extends {minimumAgeGTE: any})[] ? (T & {minimumAgeGTE: NonNullable<T['minimumAgeGTE']>})[] : never;

	return relevantData.sort((a, b) => a.minimumAgeGTE! - b.minimumAgeGTE!).reduce((acc, {minimumAgeGTE: nextMinimumAgeGTE}) => {
		const previous = acc.at(-1);
		if (previous && previous[0] < nextMinimumAgeGTE + 3) previous[1] = nextMinimumAgeGTE! - 1;

		acc.push([nextMinimumAgeGTE!, null]);
		return acc;
	}, [] as [number, number | null][])
}
