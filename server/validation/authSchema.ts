import * as yup from "yup";
export * as yup from "yup";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const registerSchema = yup.object({
    username: yup.string().required().min(5).max(30).trim(),
    email: yup.string().matches(emailRegex, "Email is invalid").required().trim(),
    password: yup.string().required().min(5).trim().notOneOf([yup.ref("username")], "Password can't be same as your username"),
});

export const loginSchema = yup.object({
    username: yup.string().required().min(5).max(30).trim(),
    password: yup.string().required().min(5).trim(),
});

export const updatePasswordSchema = yup.object({
    password: yup.string().min(5),
});

export const updateUserInfoSchema = yup.object({
    username: yup.string().min(5).max(100).required(),
    email: yup.string().email("Email is invalid").required(),
});