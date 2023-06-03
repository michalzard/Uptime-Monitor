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
    token VARCHAR(24) NOT NULL UNIQUE,
    service VARCHAR(100)
);
`;

const createPageTable: string = ` 
CREATE TABLE IF NOT EXISTS page(
    user_pk INT REFERENCES "user"(pk),
    id VARCHAR(24) NOT NULL UNIQUE,
    name VARCHAR(255),
    ispublic BOOLEAN NOT NULL DEFAULT FALSE
);
`
const createAwsImageTable: string = `
CREATE TABLE IF NOT EXISTS aws_img(
    user_pk INT REFERENCES "user"(pk),
    name VARCHAR(255) NOT NULL UNIQUE
);
`;

// TODO: add timestamp into table for when component is supposed to start timeline
const createComponentTable: string =`
CREATE TABLE IF NOT EXISTS component(
    page_id VARCHAR(24) REFERENCES page(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    createdAt
);
`;



export const createTables = createUserTable.concat(createSessionTable, createPageTable, createAwsImageTable);
