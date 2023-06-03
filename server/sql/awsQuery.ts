//FIXME: make query check if record exists,
// if it does then rename file with new name
// if it doesnt then insert
export const updateExistingAwsImageRef: string = `
UPDATE aws_img SET name = $2 WHERE user_pk = $1
`
export const createAwsImageRef: string = `
INSERT INTO aws_img(user_pk,name) VALUES($1,$2)
`