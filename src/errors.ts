
export class NoRefreshTokenError extends Error {
    constructor(id?: bigint) {
        super(`User with ID ${id} does not have a refresh token!`);
        this.name = 'NoRefreshTokenError';
    }
}

export class InvalidGrantError extends Error {
    constructor(id?: bigint, public originalError?: Error) {
        super(`User with ID ${id} has an invalid access token but it is not expired! They may need to reauthenticate.`);
        this.name = 'InvalidGrantError';
    }
}

export class ExpiredAccessTokenError extends Error {
    constructor(id?: bigint) {
        super(`User with ID ${id} has an expired access token! Did you forget to call refreshToken()?`);
        this.name = 'ExpiredAccessTokenError';
    }
}
