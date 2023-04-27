import * as yup from "yup";
import { useFormik } from "formik";
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { GithubIcon, GoogleIcon, LoadingSpinner } from '../../Icons';
import { useEffect } from "react";

function SignIn() {
    const navigate = useNavigate();
    const userState = useUserStore();
    const loginValidation = yup.object({
        username: yup.string().required().min(5).max(30).trim(),
        password: yup.string().required().min(5).trim(),
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginValidation,
        onSubmit: (values, form) => {
            userState.login(values, navigate);
            form.resetForm();
        }
    });

    const searchQuery = new URLSearchParams(useLocation().search);
    useEffect(() => {
        // check session if loading
        const githubCode = searchQuery.get("code");
        if (!userState.isLoading && !userState.isLoggedIn && githubCode) {
            userState.githubAuth(githubCode!, navigate);
        }
    }, [location]);

    if (!userState.isLoading && userState.isLoggedIn) return <Navigate to="/" />
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center px-2 bg-slate-50">
            <form onSubmit={handleSubmit} className="rounded-md flex flex-col items-center max-[639px]:w-full sm:w-96  py-10 pt-6 shadow-xl bg-white border ">
                <p className="font-semibold text-3xl mb-3">
                    Sign into <span className="text-blue-700 text-3xl font-bold tracking-widest">SENTINEL</span>
                </p>
                {/* 3rd party logons */}
                <section className="flex items-center justify-center">
                    <button onClick={userState.githubRedirect} className="mr-1 flex border border-black rounded-xl px-3 py-1.5">
                        <GithubIcon className="mr-2 w-6 h-6 overflow-visible" />
                        <span className="text-black tracking-wide font-semibold">Github</span>
                    </button>
                    <button className="ml-1 flex border border-orange-500 rounded-xl px-3 py-1.5">
                        <GoogleIcon className="mr-5 w-3 h-3 overflow-visible" />
                        <span className="text-black tracking-wide font-semibold">Google</span>
                    </button>
                </section>
                {/* divider */}
                <section className="p-1">
                    or
                </section>
                {/*  */}
                <section className="flex flex-col w-full px-6 pt-2">
                    <input id="username" type=" text" placeholder="Your nickname" required value={values.username} onChange={handleChange} onBlur={handleBlur}
                        className={` ${errors.username && touched.username ? " border-red-500" : ""} border-b
                         focus:outline-blue-500 border-gray-300 mb-2 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm`} />
                    <span className="text-sm text-red-500">{errors.username && touched.username ? errors.username : ""}</span>

                    <input id="password" type="password" placeholder="Your password" required value={values.password} onChange={handleChange} onBlur={handleBlur}
                        className={`${errors.password && touched.password ? " border-red-500" : ""} border-b
                        focus:outline-blue-500 border-gray-300 mb-2 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm`} />
                    <span className="text-sm text-red-500">{errors.password && touched.password ? errors.password : ""}</span>
                    <span className="text-sm text-red-500">{userState.status?.toLowerCase().includes("user") ? userState.status : ""}</span>

                    <button type="submit" className={`bg-blue-700 text-white rounded-md py-2 font-semibold tracking-wide 
                    flex items-center justify-center`} disabled={isSubmitting}>
                        Sign in {isSubmitting ? <LoadingSpinner className="ml-2 h-1.5 overflow-visible text-blue-400 -translate-y-2.5" /> : null}
                    </button>
                    {/* forgot pw */}
                    <p onClick={() => navigate("/signup")} className="text-blue-600 mt-2 cursor-pointer">Need an account? Sign up</p>
                    <p onClick={() => navigate("/forgot-password")} className="text-blue-600 cursor-pointer">Forgot your password?</p>
                </section>
            </form>
        </div >
    )
}

export default SignIn;