export const createNewPage: string = `
INSERT INTO page(user_pk,id,name,ispublic) VALUES($1,$2,$3,$4) RETURNING id,name,ispublic
`;

export const findUserPages: string = `
SELECT * FROM page WHERE user_pk = $1;
`;