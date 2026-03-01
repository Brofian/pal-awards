import database from "@/server/database/Database.ts";
import {
    TABLE_AUTH_TOKENS, TABLE_USERS, TABLE_USERS_MAP,
    type TABLE_USERS_SCHEMA
} from "@/server/database/Tables.ts";
import type {TranslationKey} from "@/shared/translation/Translation.ts";
import {
    DuckDBBooleanType,
    DuckDBIntegerType,
    DuckDBStringLiteralType,
    DuckDBVarCharType
} from "@duckdb/node-api/lib/DuckDBType";

export type AuthenticationResult = {
    authenticated: false,
} | {
    authenticated: true,
    userUuid: string;
    username: string;
    verified: boolean;
};


class Authentication {

    async authenticateToken(token: string): Promise<AuthenticationResult> {
        const queryResult = await database.query<TABLE_USERS_SCHEMA>(`
            SELECT u.*
            FROM ${TABLE_AUTH_TOKENS} AS aut
            LEFT JOIN ${TABLE_USERS} AS u
              ON u.uuid = aut.user_id
            WHERE aut.token = $token
              AND (aut.valid_until IS NULL OR aut.valid_until > current_localtimestamp())
              AND aut.is_mail_verification = false
                LIMIT 1
        `, {
            "token": token
        });

        const row = queryResult.getOne();
        if (row) {
            const user = TABLE_USERS_MAP(row);
            return {
                authenticated: true,
                userUuid: user['uuid'],
                username: user['username'],
                verified: user['verified'],
            };
        }
        else {
            return {authenticated: false};
        }
    }

    async getUserByUUID(uuid: string) {
        const queryResult = await database.query<TABLE_USERS_SCHEMA>(`
            SELECT u.*
            FROM ${TABLE_USERS} AS u
            WHERE at.uuid = $uuid
            LIMIT 1
        `, {
            "uuid": uuid,
        });
        const row = queryResult.getOne();
        if (row) {
            return TABLE_USERS_MAP(row);
        }
        return undefined;
    }

    async getUserByNameOrEmail(nameOrEmail: string) {
        const queryResult = await database.query<TABLE_USERS_SCHEMA>(`
            SELECT u.*
            FROM ${TABLE_USERS} AS u
            WHERE u.username = $nameOrEmail
               OR u.email = $nameOrEmail
            LIMIT 1
        `, {
            "nameOrEmail": nameOrEmail,
        });
        const row = queryResult.getOne();
        if (row) {
            return TABLE_USERS_MAP(row);
        }
        return undefined;
    }

    async attemptUserLogin(nameOrEmail: string, password: string) {
        const user = await this.getUserByNameOrEmail(nameOrEmail);
        if (!user) {
            // user does not exist
            return undefined;
        }

        if (!await Bun.password.verify(password, user.password)) {
            // password incorrect
            return undefined;
        }

        const tokenDuration = 1000 * 60 * 60 * 24 * 30;
        const newToken = await this.createAccessToken(user.uuid, tokenDuration);
        return {
            user: user,
            token: newToken,
            tokenTTL: tokenDuration,
        }
    }

    async attemptRegistration(email: string, username: string, password: string): Promise<{
        success: false,
        error: TranslationKey
    } | {
        success: true,
        user: ReturnType<typeof TABLE_USERS_MAP>,
        authToken: string,
        authTokenTTL: number,
        verificationToken: string,
    }> {
        const existing = await database.query<[boolean, boolean]>(`
            SELECT u.email = $email, u.username = $username 
            FROM ${TABLE_USERS} AS u 
            WHERE u.email = $email OR u.username = $username 
        `, {
            "email": email,
            "username": username
        });
        const existingChecks = existing.getOne();
        if (undefined !== existingChecks) {
            // user already exists
            const error: TranslationKey = existingChecks[0] ?
                "auth.registration.error.email_unavailable" :
                "auth.registration.error.username_unavailable";
            return {
                success: false,
                error: error
            };
        }

        const passwordHash = await Bun.password.hash(password);
        await database.execute(`
            INSERT INTO ${TABLE_USERS} (email, username, password) 
            VALUES ($email, $username, $password)`, {
            "email": email,
            "username": username,
            "password": passwordHash,
        });

        const userData = await this.attemptUserLogin(email, password);
        if (!userData) {
            // user could not be created
            return {
                success: false,
                error: "generic_error"
            };
        }

        const verificationToken = await this.createVerificationToken(userData.user.uuid);
        return {
            success: true,
            user: userData.user,
            authToken: userData.token,
            authTokenTTL: userData.tokenTTL,
            verificationToken: verificationToken,
        };
    }

    createVerificationToken(userId: string): Promise<string> {
        // 2 hours of verification time
        const duration = 1000 * 60 * 60 * 2;
        return this.createAccessToken(userId, duration, true);
    }

    private async createAccessToken(userId: string, durationMS: number, isVerification: boolean = false): Promise<string> {
        const token = crypto.randomUUID();
        const validUntil = Date.now() + durationMS;

        await database.execute(`
            INSERT INTO ${TABLE_AUTH_TOKENS}
            VALUES ($userId, $token, $isVerification, make_timestamp_ms($validUntil :: INT64))
        `, {
            "userId": userId,
            "token": token,
            "validUntil": BigInt(validUntil),
            "isVerification": isVerification
        });
        console.log("validUntil: " + validUntil);

        return token;
    }

}

const authentication = new Authentication();
export default authentication;