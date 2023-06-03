//session
export const saveToSession: string = `
INSERT INTO "session"(token,user_pk,service) VALUES($1,$2,$3)
RETURNING token,service`;
export const findSessionByToken: string = `
SELECT "session".*,"user".*,"aws_img".name AS aws_img_name FROM "session" 
INNER JOIN "user" ON "user".pk = "session".user_pk
LEFT JOIN aws_img ON aws_img.user_pk = "user".pk AND aws_img.user_pk IS NOT NULL
WHERE token = $1; 
`;
export const deleteSessionByToken: string = `
DELETE FROM "session" WHERE token = $1;
`;
// registration
export const checkExistingUser: string = `
SELECT * FROM "user" WHERE username = $1 OR email = $2; 
`;
export const registerUser: string = `
INSERT INTO "user"(username,email,password,avatar_url,id) VALUES($1,$2,$3,$4,$5) 
RETURNING pk,username,email,avatar_url;
`;
// user
export const findUserByUsername: string = `
SELECT * FROM "user" WHERE username = $1;
`;
// might delete this 
export const findUserByPrimaryKey: string = `
SELECT *,name AS aws_img_name FROM "user" 
INNER JOIN aws_img 
ON "user".pk = aws_img.user_pk;
`;
export const updateUserAvatarURLByPK: string = `
UPDATE "user" SET avatar_url = $2 WHERE pk = $1 
`;

export const updateUserInfo: string = `
UPDATE "user" SET username = $2,email = $3 WHERE pk = $1
`;
export const updateUserPassword: string = `
UPDATE "user" SET password = $2 WHERE pk = $1
`;
