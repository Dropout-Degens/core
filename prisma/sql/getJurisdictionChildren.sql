-- @param {String} $1:parentId The ID of the jurisdiction to recursively fetch children for.
-- @param {Int} $2:take The maximum number of records to return
-- @param {Int} $3:skip The number of records to skip

WITH RECURSIVE jurisdiction_tree AS (
    SELECT
        jr.id,
        jr.name,
        jr."countryCode",
        jr."regionCode",
        jr."parentJurisdictionId",
        1 as depth,
        ARRAY[jr.name] as "nameTree"
    FROM "private"."Jurisdiction" jr
    WHERE jr.id = $1::UUID

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
    INNER JOIN jurisdiction_tree jc ON j."parentJurisdictionId" = jc.id
)

SELECT
    id,
    name,
    "countryCode",
    "regionCode",
    "parentJurisdictionId",
    depth,
    "nameTree",
    COUNT(*) OVER() as total
FROM jurisdiction_tree
ORDER BY "nameTree" ASC
LIMIT $2 OFFSET $3;
