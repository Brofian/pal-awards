import {DuckDBTimestampMillisecondsValue} from "@duckdb/node-api";


// Table: "migrations"  | Columns: (filename, executed_at)
export const TABLE_MIGRATIONS = "migrations";
// the types of the two columns
type TABLE_MIGRATIONS_SCHEMA = [string, DuckDBTimestampMillisecondsValue];
// a function for mapping a full row onto an object
export function TABLE_MIGRATIONS_MAP(data: TABLE_MIGRATIONS_SCHEMA) {
    return {filename: data[0], executed_at: data[1]};
}
export {type TABLE_MIGRATIONS_SCHEMA}

/* ---------------------------------------------------------------------------- */

// Table: "users"  | Columns: (uuid, email, username, password, verified, updated_at, created_at)
export const TABLE_USERS = "users";
type TABLE_USERS_SCHEMA = [string, string, string, string, boolean, DuckDBTimestampMillisecondsValue, DuckDBTimestampMillisecondsValue];
export function TABLE_USERS_MAP(data: TABLE_USERS_SCHEMA) {
    return {
        uuid: data[0],
        email: data[1],
        username: data[2],
        password: data[3],
        verified: data[4],
        updated_at: data[5],
        created_at: data[6]
    };
}
export {type TABLE_USERS_SCHEMA}

/* ---------------------------------------------------------------------------- */

// Table: "auth_tokens"  | Columns: (user_id, token, is_mail_verification, valid_until)
export const TABLE_AUTH_TOKENS = "auth_tokens";
type TABLE_AUTH_TOKENS_SCHEMA = [string, string, boolean, DuckDBTimestampMillisecondsValue];
export function TABLE_AUTH_TOKENS_MAP(data: TABLE_AUTH_TOKENS_SCHEMA) {
    return {
        user_id: data[0],
        token: data[1],
        is_mail_verification: data[2],
        valid_until: data[3],
    };
}
export {type TABLE_AUTH_TOKENS_SCHEMA}