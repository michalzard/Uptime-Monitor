export const createUserTable: string = `
CREATE TABLE IF NOT EXISTS "user"(
    pk BIGSERIAL PRIMARY KEY NOT NULL, 
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NULL UNIQUE,
    password TEXT NULL,
    avatar_url TEXT NULL
);
`;
export const createSessionTable: string = `
CREATE TABLE IF NOT EXISTS "session"(
    user_pk INT REFERENCES "user"(pk),
    token VARCHAR(24) NOT NULL,
    service VARCHAR(100)
);
`;

export const createTables = createUserTable + createSessionTable;
