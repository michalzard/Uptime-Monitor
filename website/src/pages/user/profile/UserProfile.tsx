import { useCallback, useRef, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { LoadingSpinner } from "../../../Icons";
import { Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

function UserProfile() {
    const inputClass = `focus:outline-blue-500 disabled:text-gray-400 border-gray-300 mb-1.5 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm ring-1 ring-black/10`;
    const buttonClass = `bg-blue-600 px-3 py-1.5 rounded-md text-white font-semibold disabled:bg-gray-400 disabled:text-gray-200 w-full flex items-center justify-center`;
    const labelClass = `text-gray-700 font-semibold text-lg my-1`;
    const smallerLabelClass = `text-gray-700 font-semibold text-sm my-1.5`;
    const errorClass = `text-red-600 text-sm`;

    const [pfpHovered, setPfpHovered] = useState(false);
    const { user, isLoading, isLoggedIn, updateAvatar } = useAuthStore();

    // file preview
    const [preview, setPreview] = useState("");
    const [fileData, setFileData] = useState({});
    const [fileUploading, setFileUploading] = useState(false);
    const filePickerRef = useRef<HTMLInputElement>(null);

    const selectPfp = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("pfp", file);
            // show in preview
            const previewURL = URL.createObjectURL(file);
            setFileData(formData);
            setPreview(previewURL);
            setPfpHovered(false);
        }
    }

    const imgOnClick = useCallback(() => {
        if (filePickerRef.current) filePickerRef.current.click();
    }, [filePickerRef]);

    const imgUpload = () => {
        setFileUploading(true);
        axios.post(`${import.meta.env.VITE_API_URL}/upload`, fileData, { withCredentials: true }).then(res => {
            const { url } = res.data;
            if (url) { setPreview(""); updateAvatar(url); }
            setFileUploading(false);
        });
        setPfpHovered(false);
        setFileData({});
    }
    const cancelUpload = () => {
        setFileData({});
        setPreview("");
        setPfpHovered(false);
    }



    const infoValidationSchema = yup.object({
        username: yup.string().min(5).max(100).required(),
        email: yup.string().email("Email is invalid").required(),
    });

    const infoForm = useFormik({
        initialValues: {
            username: user?.username,
            email: user?.email,
        },
        validationSchema: infoValidationSchema,
        onSubmit: (values, form) => {
            axios.post(`${import.meta.env.VITE_API_URL}/auth/update`, { ...values }, { withCredentials: true }).then(res => {
                // const { message } = res.data;
                form.setSubmitting(false);
            }).catch(console.error);
        }
    });
    // password
    const passwordValidationSchema = yup.object({
        password: yup.string().min(5).required(),
        verifyPassword: yup.string().min(5).oneOf([yup.ref("password")], "This must match password").required("password verification is required"),
    });

    const passwordForm = useFormik({
        initialValues: {
            password: "",
            verifyPassword: "",
        },
        validationSchema: passwordValidationSchema,
        onSubmit: (values, form) => {
            axios.post(`${import.meta.env.VITE_API_URL}/auth/update-password`, { password: values.password }, { withCredentials: true }).then(res => {
                // const { message } = res.data;
                form.setSubmitting(false);
            }).catch(console.error);
        }
    });

    console.log(passwordForm.values);

    if (!isLoading && !isLoggedIn) return <Navigate to="/signin" />
    return (
        <>
            <section className="w-full lg:w-96 my-2">
                <label className={labelClass}>General Info</label>
                {
                    isLoading ? <LoadingSpinner className="w-8 h-8 text-blue-500" />
                        :
                        <section className="flex items-center">
                            <input ref={filePickerRef} type="file" name="avatar_upload" id="avatar_upload" accept=".png,.jpg,.webp"
                                onChange={selectPfp} className="hidden" />
                            <div
                                onMouseEnter={() => setPfpHovered(true)}
                                onMouseLeave={() => setPfpHovered(false)}
                                onClick={imgOnClick}
                                className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                                style={{ filter: pfpHovered ? "grayscale(100%)" : "none" }}
                            >
                                <div
                                    className="bg-blue-700 rounded-full w-full h-full flex items-center justify-center"
                                    style={{ filter: pfpHovered ? "blur(1px)" : "none" }}
                                >
                                    {user?.avatar_url || preview ?
                                        fileUploading ? <LoadingSpinner className="w-10 h-10 text-blue-500" /> :
                                            <img src={preview ? preview : user?.avatar_url}
                                                onMouseEnter={() => setPfpHovered(true)}
                                                onMouseLeave={() => setPfpHovered(false)}
                                                className="w-12 h-12 rounded-full cursor-pointer" />
                                        :
                                        <UserIcon className="w-8 h-8 text-white z-10" />
                                    }
                                </div>
                                <div
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none ${pfpHovered ? "visible" : "hidden"}`}
                                >
                                    <PlusIcon className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            {
                                preview ?
                                    <>
                                        <button className="ml-3 text-blue-700 font-semibold"
                                            onClick={imgUpload}>Save?</button>
                                        <button className="ml-3 text-red-700 font-semibold" onClick={cancelUpload}>Delete?</button>
                                    </>
                                    : null
                            }
                        </section>
                }
                <form onSubmit={infoForm.handleSubmit}>
                    <div className="flex flex-col my-2">
                        {/* username */}
                        <label className={smallerLabelClass}>Username</label>
                        <input type="text" id="username" className={inputClass} value={infoForm.values.username} onChange={infoForm.handleChange} onBlur={infoForm.handleBlur} />
                        <span className={errorClass}>{infoForm.errors.username}</span>
                        {/* email */}
                        <label className={smallerLabelClass}>Email</label>
                        <input type="text" id="email" className={inputClass} value={infoForm.values.email} onChange={infoForm.handleChange} onBlur={infoForm.handleBlur} />
                        <span className={errorClass}>{infoForm.errors.email}</span>

                    </div>
                    <button type="submit" className={buttonClass} disabled={infoForm.isSubmitting}>Save changes {infoForm.isSubmitting ?
                        <LoadingSpinner className="ml-1 h-5 text-white" /> : null}</button>
                </form>
            </section>

            <form onSubmit={passwordForm.handleSubmit} className="w-full lg:w-96 flex flex-col">
                <div className="flex flex-col my-2">
                    <label className={labelClass}>Password</label>
                    <label className={smallerLabelClass}>New Password</label>

                    <input type="password" id="password" className={inputClass} value={passwordForm.values.password} onBlur={passwordForm.handleBlur} onChange={passwordForm.handleChange} />
                    <span className={errorClass}>{passwordForm.touched.password ? passwordForm.errors.password : ""}</span>
                    <label className={smallerLabelClass}>Verify Password</label>
                    <input type="password" id="verifyPassword" className={inputClass} value={passwordForm.values.verifyPassword} onBlur={passwordForm.handleBlur} onChange={passwordForm.handleChange} />
                    <span className={errorClass}>{passwordForm.touched.verifyPassword ? passwordForm.errors.verifyPassword : ""}</span>
                </div>
                <button type="submit" className={buttonClass} disabled={passwordForm.isSubmitting}>Save changes {passwordForm.isSubmitting ?
                    <LoadingSpinner className="ml-1 h-5 text-white" /> : null}</button>
            </form>
        </>
    )
}

export default UserProfile;