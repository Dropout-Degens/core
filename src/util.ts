import RoleFlags from "./definitions.js";

export function findHighestApplicableRole(roleFlags: number): [keyof typeof RoleFlags, RoleFlags] | undefined {
    const sortedRoleFlags = ((Object.entries(roleFlags) as ([keyof typeof RoleFlags, RoleFlags]|[RoleFlags, keyof typeof RoleFlags])[])
        .filter(([k, v]) => typeof k === 'string' && typeof v === 'number' && (v.toString(2).match(/1/g)?.length ?? 0) < 2) as [keyof typeof RoleFlags, RoleFlags][])
        .sort((a, b) => b[1] - a[1]);

    for (const entry of sortedRoleFlags)
        if (roleFlags & entry[1]) return entry;
}

export function getGenericMappingAgainstRoleFlags<T extends Record<string, unknown>, D extends unknown, V = T extends Record<keyof typeof RoleFlags, infer V> ? V : never>(userRoles: number, mapping: T, defaultValue: D): V[keyof V] | D {
    let returnValue: V[keyof V] | D = defaultValue;

    for (const [roleName_, roleMappedValue_] of Object.entries(mapping)) {

        const roleName = roleName_ as keyof V;
        const roleMappedValue = roleMappedValue_ as V[keyof V];

        if (typeof roleName !== 'string') continue;
        if ( !(roleName in RoleFlags) ) {
            console.warn(`WARN: Invalid role name ${roleName}`);
            continue;
        }

        if (userRoles & RoleFlags[roleName as keyof typeof RoleFlags]) {
            returnValue = roleMappedValue;
        }
    }

    return returnValue;
}
