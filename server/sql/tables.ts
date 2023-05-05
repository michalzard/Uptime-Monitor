const createUserTable: string = `
CREATE TABLE IF NOT EXISTS "user"(
    pk BIGSERIAL PRIMARY KEY NOT NULL, 
    id VARCHAR(50), 
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NULL UNIQUE,
    password TEXT NULL,
    avatar_url TEXT NULL
);
`;
const createSessionTable: string = `
CREATE TABLE IF NOT EXISTS "session"(
    user_pk INT REFERENCES "user"(pk),
    token VARCHAR(24) NOT NULL,
    service VARCHAR(100)
);
`;

const createPageTable: string = ` 
CREATE TABLE IF NOT EXISTS page(
    user_pk INT REFERENCES "user"(pk),
    id VARCHAR(50),
    name VARCHAR(255),
    ispublic BOOLEAN NOT NULL DEFAULT FALSE
);
`

export const createTables = createUserTable.concat(createSessionTable, createPageTable);
