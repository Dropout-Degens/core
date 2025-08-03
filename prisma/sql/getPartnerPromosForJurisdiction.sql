-- @param {String} $1:jurisdictionId The ID of the jurisdiction to fetch partner promos for
-- @param {Int} $2:minAge? The user's age to check against minimum age requirements (optional, pass NULL to ignore)
-- @param {Int} $3:maxAge? The user's age to check against maximum age requirements (optional, pass NULL to ignore)
-- @param {Int} $4:take The maximum number of records to return
-- @param {Int} $5:skip The number of records to skip
-- @param {BigInt} $6:userId The ID of the user making the request (optional, pass NULL if not needed)
-- @param {Boolean} $7:includeClaimed? Whether to include promos claimed by the user (will include both if null)

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
        -- 1. Definitely meets age requirement ($2:minAge is GTE the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = true ($2:minAge GTE the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = true ($3:maxAge, which is always GTE $2:minAge, is also GTE the promo's minimumAgeGTE)
        -- 2. Does not meet age requirement ($3:maxAge is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = false ($2:minAge, which is always LTE $3:maxAge, is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = false ($3:maxAge LT the promo's minimumAgeGTE)
        -- 3. Maybe meets age requirement ($3:maxAge is GTE the promo's minimumAgeGTE but the $2:minAge is LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_definitely = false ($2:minAge LT the promo's minimumAgeGTE)
        --    - meets_age_requirement_maybe = true ($3:maxAge GTE the promo's minimumAgeGTE)

        (pp."minimumAgeGTE" IS NULL OR ($2::INT IS NOT NULL AND $2::INT >= pp."minimumAgeGTE")) as meets_age_requirement_definitely,
        (pp."minimumAgeGTE" IS NULL OR $3::INT IS NULL OR $3::INT >= pp."minimumAgeGTE") as meets_age_requirement_maybe,

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
            EXISTS (
                SELECT 1
                FROM "private"."PartnerPromoClaim"
                WHERE "promoId" = pp.id AND "userId" = $6::BIGINT
            )
        ) as is_claimed

    FROM "private"."PartnerPromo" pp
)



SELECT
    pp.id,
    pp."displayName",
    pp."minimumAgeGTE",
    -- Validity checks
    pv.is_claimed as "isClaimed",
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement_maybe) as "canClaim",
    pv.meets_age_requirement_definitely as "meetsAgeRequirementDefinitely",
    pv.meets_age_requirement_maybe as "meetsAgeRequirementMaybe",
    -- Name tree for the jurisdiction hierarchy
    jr."nameTree" as "jurisdictionNameTree",
    -- Total number of records
    COUNT(*) OVER() as total

FROM "private"."PartnerPromo" pp

LEFT JOIN promo_validity pv ON pp.id = pv.promo_id
LEFT JOIN jurisdiction_hierarchy jr ON jr."parentJurisdictionId" IS NULL

WHERE
    ($7::Boolean IS NULL OR (pv.is_claimed = $7::Boolean)) AND (pp."isActive" = true OR pv.is_claimed = true)

ORDER BY
    (pv.included_by_id IS NOT NULL AND pv.excluded_by_id IS NULL AND pv.meets_age_requirement_maybe) DESC,  -- Valid promos first
    pv.meets_age_requirement_definitely DESC,
    pv.meets_age_requirement_maybe DESC,
    (pv.included_by_id IS NOT NULL) DESC,
    (pv.excluded_by_id IS NOT NULL) ASC,
    pp."displayName" ASC

LIMIT $4 OFFSET $5;
