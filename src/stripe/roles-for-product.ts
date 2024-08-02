import type Stripe from "stripe";
import RoleFlags, { type PurchasablePlan } from "../definitions.js";

export function getRolesForProduct(product: Stripe.Product) {
    const rolesToGrantRaw = product.metadata['grants-roles'];

    if (!rolesToGrantRaw)
        throw new Error(`!!! CRITICAL !!! Subscription product missing "grants-roles" metadata but we tried to get roles from it: ${JSON.stringify(product, null, 4)}`);

    return getRolesForProductFromRolesString(rolesToGrantRaw);
}

export function getRolesForProductUIEdition(product: Stripe.Product) {
    const uiRoles = product.metadata['ui-as'];
    if (!uiRoles)
        throw new Error(`!!! CRITICAL !!! Subscription product missing "ui-as" metadata but we tried to get roles from it: ${JSON.stringify(product, null, 4)}`);

    return getRolesForProductFromRolesString(uiRoles);
}

export function getRolesForProductFromRolesString(rolesToGrantRaw: string, productForErrorPurpose?: Stripe.Product) {
    const rolesToGrantNames = rolesToGrantRaw.split(',').map(role => role.trim()) as (keyof typeof RoleFlags)[];

    let tier: number = 0;
    for (const roleName of rolesToGrantNames) {
        const raw = roleName + 'Raw' as (`${keyof typeof RoleFlags}Raw`);
        if (raw in RoleFlags)
            tier |= RoleFlags[raw as keyof typeof RoleFlags];
        else if (roleName in RoleFlags)
            tier |= RoleFlags[roleName];
        else
            throw new Error(`!!! CRITICAL !!! Unknown role name in subscription product's "grant-roles" metadata: ${roleName}; ${JSON.stringify(productForErrorPurpose, null, 4)}`);
    }

    return tier;
}
