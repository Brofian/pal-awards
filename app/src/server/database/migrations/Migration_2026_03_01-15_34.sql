CREATE TABLE IF NOT EXISTS "users"
(
    uuid UUID PRIMARY KEY NOT NULL DEFAULT uuidv7(),
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE CHECK (username NOT LIKE '%@%') NOT NULL,
    password VARCHAR NOT NULL,
    verified BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMP_MS DEFAULT current_localtimestamp(),
    created_at TIMESTAMP_MS DEFAULT current_localtimestamp() NOT NULL
);

CREATE TABLE IF NOT EXISTS "auth_tokens"
(
    user_id UUID NOT NULL REFERENCES users(uuid),
    token VARCHAR UNIQUE NOT NULL,
    is_mail_verification BOOLEAN NOT NULL DEFAULT false,
    valid_until TIMESTAMP_MS
);