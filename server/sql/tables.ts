export const createUserTable: string = `
CREATE TABLE IF NOT EXISTS "user"(
    pk SERIAL PRIMARY KEY, 
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
	id CHAR(24) NOT NULL UNIQUE
);

`;
export const createSessionTable: string = `
CREATE TABLE IF NOT EXISTS "session"(
    token CHAR(24) NOT NULL,
    user_pk INT REFERENCES "user"(pk)
);
`;

export const createTables = createUserTable + createSessionTable;
