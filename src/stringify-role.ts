import RoleFlags from "./definitions.js"



export function stringifyUserRole(role: number): string {

    if (role & RoleFlags.Admin) return 'Admin';
    if (role & RoleFlags.UnknownStaff2) return 'Staff';
    if (role & RoleFlags.UnknownStaff3) return 'Staff';
    if (role & RoleFlags.UnknownStaff4) return 'Staff';
    if (role & RoleFlags.UnknownStaff5) return 'Staff';
    if (role & RoleFlags.Degen) return 'Degen';
    if (role & RoleFlags.Capper) return 'Capper';
    if (role & RoleFlags.GenericStaff) return 'Staff';

    if (role & RoleFlags.Reserved1) return 'Unknown Role';
    if (role & RoleFlags.Reserved2) return 'Unknown Role';
    if (role & RoleFlags.Reserved3) return 'Unknown Role';
    if (role & RoleFlags.Reserved4) return 'Unknown Role';
    if (role & RoleFlags.Reserved5) return 'Unknown Role';
    if (role & RoleFlags.Reserved6) return 'Unknown Role';
    if (role & RoleFlags.Reserved7) return 'Unknown Role';
    if (role & RoleFlags.Reserved8) return 'Unknown Role';

    if (role & RoleFlags.Van_HighRoller) return 'High Roller';
    if (role & RoleFlags.VanityRole2) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole3) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole4) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole5) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole6) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole7) return 'Unknown Premium Vanity Role'
    if (role & RoleFlags.VanityRole8) return 'Unknown Premium Vanity Role'

    if (role & RoleFlags.AllAccess) return 'All Access';
    if (role & RoleFlags.PlayerProps) return 'Player Props';
    if (role & RoleFlags.Sportsbook) return 'Sportsbook';
    if (role & RoleFlags.PremiumRole3) return 'Unknown Premium Role'
    if (role & RoleFlags.PremiumRole4) return 'Unknown Premium Role'
    if (role & RoleFlags.PremiumRole5) return 'Unknown Premium Role'
    if (role & RoleFlags.PremiumRole6) return 'Unknown Premium Role'
    if (role & RoleFlags.PremiumRole7) return 'Unknown Premium Role'
    if (role & RoleFlags.PremiumRole8) return 'Unknown Premium Role'

    return 'Free User'
}

export function stringifyPlan(role: number): string {

    if (role & RoleFlags.Admin) return 'Administrator Status';
    if (role & RoleFlags.UnknownStaff2) return 'Unknown Staff Role';
    if (role & RoleFlags.UnknownStaff3) return 'Unknown Staff Role';
    if (role & RoleFlags.UnknownStaff4) return 'Unknown Staff Role';
    if (role & RoleFlags.UnknownStaff5) return 'Unknown Staff Role';
    if (role & RoleFlags.Degen) return 'Degen';
    if (role & RoleFlags.Capper) return 'Capper';
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
    if (role & RoleFlags.PlayerProps) return 'Player Props Access';
    if (role & RoleFlags.Sportsbook) return 'Sportsbook Access';
    if (role & RoleFlags.PremiumRole3) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole4) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole5) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole6) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole7) return 'Unknown Premium Subscription'
    if (role & RoleFlags.PremiumRole8) return 'Unknown Premium Subscription'

    return 'No Plan'
}
