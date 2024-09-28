import RoleFlags, { DiscountSource } from "./definitions"



export function stringifyUserRole(role: number): ['a'|'an', string] {

    if (role & RoleFlags.Admin) return ['an', 'Administrator'];
    if (role & RoleFlags.UnknownStaff2) return ['an', 'Unknown Type of Staff'];
    if (role & RoleFlags.Developer) return ['a', 'Developer'];
    if (role & RoleFlags.Degen) return ['a', 'Degen'];
    if (role & RoleFlags.Capper) return ['a', 'Capper'];
    if (role & RoleFlags.Moderator) return ['a', 'Moderator'];
    if (role & RoleFlags.GenericStaff) return ['a', 'Staff Member'];

    //if (role & RoleFlags.Reserved1) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved1) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved2) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved3) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved4) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved5) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved6) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved7) return ['an', 'Unknown Type of Subscriber'];
    if (role & RoleFlags.Reserved8) return ['an', 'Unknown Type of Subscriber'];

    if (role & RoleFlags.Van_HighRoller) return ['a', 'High Roller'];
    if (role & RoleFlags.VanityRole2) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole3) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole4) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole5) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole6) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole7) return ['an', 'Unknown Premium Vanity Status']
    if (role & RoleFlags.VanityRole8) return ['an', 'Unknown Premium Vanity Status']

    if (role & RoleFlags.AllAccess) return ['an', 'All Access Subscriber'];
    if (role & RoleFlags.ExpectedValue) return ['a', 'Expected Value Subscriber'];
    if (role & RoleFlags.Betting) return ['a', 'Betting Access Subscriber'];
    if (role & RoleFlags.PremiumRole3) return ['an', 'Unknown Type of Premium Subscriber'];
    if (role & RoleFlags.PremiumRole4) return ['an', 'Unknown Type of Premium Subscriber'];
    if (role & RoleFlags.PremiumRole5) return ['an', 'Unknown Type of Premium Subscriber'];
    if (role & RoleFlags.PremiumRole6) return ['an', 'Unknown Type of Premium Subscriber'];
    if (role & RoleFlags.PremiumRole7) return ['an', 'Unknown Type of Premium Subscriber'];
    if (role & RoleFlags.PremiumRole8) return ['an', 'Unknown Type of Premium Subscriber'];

    return ['a', 'free user'];
}



export function stringifyPlan(role: number): string {

    if (role & RoleFlags.Admin) return 'Administrator';
    if (role & RoleFlags.UnknownStaff2) return 'Unknown Staff Role';
    if (role & RoleFlags.Developer) return 'Developer';
    if (role & RoleFlags.Degen) return 'Degen';
    if (role & RoleFlags.Capper) return 'Capper';
    if (role & RoleFlags.Moderator) return 'Moderator';
    if (role & RoleFlags.GenericStaff) return 'Staff';

    if (role & RoleFlags.Reserved1) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved2) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved3) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved4) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved5) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved6) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved7) return 'Unknown Subscription';
    if (role & RoleFlags.Reserved8) return 'Unknown Subscription';

    if (role & RoleFlags.Van_HighRoller) return 'High Roller status';
    if (role & RoleFlags.VanityRole2) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole3) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole4) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole5) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole6) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole7) return 'Unknown Premium Vanity Status'
    if (role & RoleFlags.VanityRole8) return 'Unknown Premium Vanity Status'

    if (role & RoleFlags.AllAccess) return 'All Access';
    if (role & RoleFlags.ExpectedValue) return 'Expected Value Access';
    if (role & RoleFlags.Betting) return 'Betting Access';
    if (role & RoleFlags.PremiumRole3) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole4) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole5) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole6) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole7) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole8) return 'Unknown Premium Subscription'

    return 'No Plan'
}

export function stringifyDiscountSource(source: DiscountSource) {
    switch (source) {
        case DiscountSource['weekly-reward']: return 'Weekly Reward';
        case DiscountSource.manual: return 'Special Considerations';
        default: return 'Unknown Source';
    }
}
