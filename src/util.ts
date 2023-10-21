import RoleFlags from "./definitions.js";

export function findHighestApplicableRole(roleFlags: number): [keyof typeof RoleFlags, RoleFlags] | undefined {
    const sortedRoleFlags = ((Object.entries(roleFlags) as ([keyof typeof RoleFlags, RoleFlags]|[RoleFlags, keyof typeof RoleFlags])[])
        .filter(([k, v]) => typeof k === 'string' && typeof v === 'number' && (v.toString(2).match(/1/g)?.length ?? 0) < 2) as [keyof typeof RoleFlags, RoleFlags][])
        .sort((a, b) => b[1] - a[1]);

    for (const entry of sortedRoleFlags)
        if (roleFlags & entry[1]) return entry;
}
