-- @param {String} $1:jurisdictionId The ID of the jurisdiction to fetch partner promos for
-- @param {String} $2:promoId The ID of the specific promo to fetch
-- @param {Int} $3:minAge? The user's age to check against minimum age requirements (optional, pass NULL to ignore)
-- @param {Int} $4:maxAge? The user's age to check against maximum age requirements (optional, pass NULL to ignore)
-- @param {BigInt} $5:userId The ID of the user making the request (optional, pass NULL if not needed)

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

        -- Three possible statuses for age requirement: definitely, maybe, or not met
        -- 1. Definitely meets age requirement ($3:minAge is GTE the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = true ($3:minAge GTE the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = true ($4:maxAge, which is always GTE $3:minAge, is also GTE the promo's minimumAgeGTE)
        -- 2. Does not meet age requirement ($4:maxAge is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = false ($3:minAge, which is always LTE $4:maxAge, is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = false ($4:maxAge LT the promo's minimumAgeGTE)
        -- 3. Maybe meets age requirement ($4:maxAge is GTE the promo's minimumAgeGTE but the $3:minAge is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = false ($3:minAge LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = true ($4:maxAge GTE the promo's minimumAgeGTE)

        (pp."minimumAgeGTE" IS NULL OR ($3::INT IS NOT NULL AND $3::INT >= pp."minimumAgeGTE")) as meets_age_requirement_definitely,
        (pp."minimumAgeGTE" IS NULL OR $4::INT IS NULL OR $4::INT >= pp."minimumAgeGTE") as meets_age_requirement_maybe,

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
        ) as excluded_children

    FROM "private"."PartnerPromo" pp
    WHERE pp.id = $2::UUID
)

SELECT
    pp.id,
    pp."displayName",
    pp."detailsMD",
    pp.link,
    pp."minimumAgeGTE",
    pp."detailsImageNames",
    pp."detailsImageAlts",
    -- Validity checks
    (ppc."promoId" IS NOT NULL) as "isClaimed",
    ppc."isProved" as "isClaimProved",
    ppc."proofTicketThreadId" as "claimProofTicketThreadId",
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement_maybe) as "canClaim",
    (pv.included_by_id IS NOT NULL) as "isIncluded",
    (pv.excluded_by_id IS NOT NULL) as "isExcluded",
    pv.meets_age_requirement_definitely as "meetsAgeRequirementDefinitely",
    pv.meets_age_requirement_maybe as "meetsAgeRequirementMaybe",
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
    jr."nameTree" as "jurisdictionNameTree"
FROM "private"."PartnerPromo" pp
LEFT JOIN promo_validity pv ON pp.id = pv.promo_id
LEFT JOIN "private"."Jurisdiction" ij ON pv.included_by_id = ij.id
LEFT JOIN "private"."Jurisdiction" ej ON pv.excluded_by_id = ej.id
LEFT JOIN "private"."Jurisdiction" rj ON rj.id = $1::UUID
LEFT JOIN "private"."PartnerPromoClaim" ppc ON ppc."promoId" = pp.id AND ppc."userId" = $5::BIGINT
LEFT JOIN jurisdiction_hierarchy jr ON jr."parentJurisdictionId" IS NULL
WHERE pp.id = $2::UUID AND (pp."isActive" = true OR ppc IS NOT NULL)
ORDER BY
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement_maybe) DESC,  -- Valid promos first
    pv.meets_age_requirement_definitely DESC,
    pv.meets_age_requirement_maybe DESC,
    (pv.included_by_id IS NOT NULL) DESC,
    (pv.excluded_by_id IS NOT NULL) ASC,
    pp."displayName" ASC
LIMIT 1;
