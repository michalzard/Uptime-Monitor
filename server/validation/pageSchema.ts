import * as yup from "yup";
export * as yup from "yup";

export const newPageSchema = yup.object({
    name: yup.string().min(3).max(20).required("Page name is required"),
    type: yup.string().oneOf(["public", "private"])
});