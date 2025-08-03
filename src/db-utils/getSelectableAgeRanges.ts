import db from "../db";

export async function getSelectableAgeRanges(): Promise<[minAge: number, maxAge: number | null][]> {
	const relevantData = await db.partnerPromo.findMany({
		where: {
			minimumAgeGTE: {not: null},
			isActive: true,
		},
		distinct: ['minimumAgeGTE'],
		select: {
			minimumAgeGTE: true,
		},
	})

	return relevantData.sort((a, b) => a.minimumAgeGTE! - b.minimumAgeGTE!).reduce((acc, {minimumAgeGTE}) => {
		const previous = acc.at(-1);
		if (previous) previous[1] = minimumAgeGTE! - 1;

		acc.push([minimumAgeGTE!, null]);
		return acc;
	}, [] as [number, number | null][])
}
