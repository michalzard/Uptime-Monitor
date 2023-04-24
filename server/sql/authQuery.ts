// registration
export const checkExistingUser: string = `
SELECT * FROM "user" WHERE username = $1 OR email = $2; 
`;
export const registerUser: string = `
INSERT INTO "user"(username,email,password,id) VALUES($1,$2,$3,$4) RETURNING pk,id,username,email;
`;
// 
export const findUserByUsername: string = `
SELECT * FROM "user" WHERE username = $1;
`;
export const findUserByPrimaryKey: string = `
SELECT * from "user" WHERE pk = $1;
`;
//session
export const saveToSession: string = `
INSERT INTO "session"(token,user_pk) VALUES($1,$2);
`;
export const findSessionByToken: string = `
SELECT * FROM "session" WHERE token = $1;
`;

export const findSessionByPrimaryKey: string = `
SELECT * FROM "session" WHERE user_pk = $1;
`;

export const deleteSessionByToken: string = `
DELETE FROM "session" WHERE token = $1;
`;