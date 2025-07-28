-- @param {String} $1:jurisdictionId The ID of the jurisdiction to fetch partner promos for
-- @param {String} $2:promoId The ID of the specific promo to fetch
-- @param {Int} $3:userAge? The user's age to check against minimum age requirements (optional, pass NULL to ignore)
-- @param {BigInt} $4:userId The ID of the user making the request (optional, pass NULL if not needed)

WITH RECURSIVE jurisdiction_hierarchy AS (
    -- Get the target jurisdiction and all its parents
    SELECT
        id,
        name,
        "countryCode",
        "regionCode",
        "parentJurisdictionId",
        0 as level,
        ARRAY[name] as "nameTree"
    FROM "private"."Jurisdiction"
    WHERE id = $1::UUID

    UNION ALL

    SELECT
        j.id,
        j.name,
        j."countryCode",
        j."regionCode",
        j."parentJurisdictionId",
        jh.level + 1 as level,
        array_prepend(j.name, jh."nameTree") as "nameTree"
    FROM "private"."Jurisdiction" j
    INNER JOIN jurisdiction_hierarchy jh ON j.id = jh."parentJurisdictionId"
),

jurisdiction_children AS (
    -- Get all child jurisdictions of the target jurisdiction
    SELECT
        id,
        name,
        "countryCode",
        "regionCode",
        "parentJurisdictionId",
        1 as depth,
        ARRAY[jr.name] as "nameTree"
    FROM "private"."Jurisdiction" jr
    WHERE id = $1::UUID

    UNION ALL

    SELECT
        j.id,
        j.name,
        j."countryCode",
        j."regionCode",
        j."parentJurisdictionId",
        jc.depth + 1 as depth,
        array_append(jc."nameTree", j.name) as "nameTree"
    FROM "private"."Jurisdiction" j
    INNER JOIN jurisdiction_children jc ON j."parentJurisdictionId" = jc.id
),

promo_validity AS (
    SELECT DISTINCT ON (promo_id)
        pp.id as promo_id,

        ($3::INT IS NULL OR pp."minimumAgeGTE" IS NULL OR $3::INT >= pp."minimumAgeGTE") as meets_age_requirement,

        (
            SELECT jh.id
            FROM "private"."_PartnerPromoValidJurisdictions" valid_rel
            INNER JOIN jurisdiction_hierarchy jh ON valid_rel."A" = jh.id
            WHERE valid_rel."B" = pp.id
            ORDER BY jh.level ASC
            LIMIT 1
        ) as included_by_id,

        (
            SELECT jh.id
            FROM "private"."_PartnerPromoExcludedJurisdictions" excluded_rel
            INNER JOIN jurisdiction_hierarchy jh ON excluded_rel."A" = jh.id
            WHERE excluded_rel."B" = pp.id
            ORDER BY jh.level ASC
            LIMIT 1
        ) as excluded_by_id,

        (
            SELECT COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT( -- WHEN UPDATING, BE SURE TO UPDATE THE PROMO PARTNERS TYPE DEFINITIONS AS WELL
                        'id', jc.id,
                        'name', jc.name,
                        'countryCode', jc."countryCode",
                        'regionCode', jc."regionCode",
                        'depth', jc.depth,
                        'nameTree', jc."nameTree"
                    )
                    ORDER BY jc.name
                ),
                '[]'::json
            )
            FROM "private"."_PartnerPromoExcludedJurisdictions" excluded_rel
            INNER JOIN jurisdiction_children jc ON excluded_rel."A" = jc.id
            WHERE excluded_rel."B" = pp.id
        ) as excluded_children,

        (
            EXISTS (
                SELECT 1
                FROM "private"."_PartnerPromoClaimedByUsers"
                WHERE "A" = pp.id AND "B" = $4::BIGINT
            )
        ) as is_claimed

    FROM "private"."PartnerPromo" pp
    WHERE pp.id = $2::UUID
)

SELECT
    pp.id,
    pp."displayName",
    pp."detailsMD",
    pp.link,
    pp."minimumAgeGTE",
    pp."detailsImageUrl",
    pp."detailsImageAlt",
    -- Validity checks
    pv.is_claimed as "isClaimed",
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement) as "canClaim",
    (pv.included_by_id IS NOT NULL) as "isIncluded",
    (pv.excluded_by_id IS NOT NULL) as "isExcluded",
    pv.meets_age_requirement as "meetsAgeRequirement",
    -- Excluded children data (as JSON)
    pv.excluded_children as "excludedChildren",
    -- Included jurisdiction data
    ij.id as "includedJurisdictionId",
    ij.name as "includedJurisdictionName",
    ij."countryCode" as "includedJurisdictionCountryCode",
    ij."regionCode" as "includedJurisdictionRegionCode",
    -- Excluded jurisdiction data
    ej.id as "excludedJurisdictionId",
    ej.name as "excludedJurisdictionName",
    ej."countryCode" as "excludedJurisdictionCountryCode",
    ej."regionCode" as "excludedJurisdictionRegionCode",
    -- Home jurisdiction data
    rj.id as "jurisdictionId",
    rj.name as "jurisdictionName",
    rj."countryCode" as "jurisdictionCountryCode",
    rj."regionCode" as "jurisdictionRegionCode",
    -- Name tree for the jurisdiction hierarchy
    jr."nameTree" as "jurisdictionNameTree",
    -- Total number of records
    COUNT(*) OVER() as total
FROM "private"."PartnerPromo" pp
LEFT JOIN promo_validity pv ON pp.id = pv.promo_id
LEFT JOIN "private"."Jurisdiction" ij ON pv.included_by_id = ij.id
LEFT JOIN "private"."Jurisdiction" ej ON pv.excluded_by_id = ej.id
LEFT JOIN "private"."Jurisdiction" rj ON rj.id = $1::UUID
LEFT JOIN jurisdiction_hierarchy jr ON jr."parentJurisdictionId" IS NULL
WHERE pp.id = $2::UUID
ORDER BY
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement) DESC,  -- Valid promos first
    pv.meets_age_requirement DESC,
    (pv.included_by_id IS NOT NULL) DESC,
    (pv.excluded_by_id IS NOT NULL) ASC,
    pp."displayName" ASC
LIMIT 1;
