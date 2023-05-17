import * as yup from "yup";
import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import { GithubIcon, GoogleIcon, LoadingSpinner } from "../../Icons";


function SignUp() {
    const navigate = useNavigate();
    const auth = useAuthStore();

    const signupValidation = yup.object({
        username: yup.string().required().min(5).max(30).trim(),
        email: yup.string().email().required().trim(),
        password: yup.string().required().min(5).trim().notOneOf([yup.ref("username")], "Password can't be same as your username"),
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: signupValidation,
        onSubmit: (values, form) => {
            auth.register(values, navigate);
            form.resetForm();
        }
    });

    if (!auth.isLoading && auth.isLoggedIn) return <Navigate to="/" />
    return (
        <main className="w-screen h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
            <form onSubmit={handleSubmit} className="rounded-md flex flex-col items-center w-96 py-10 pt-6 shadow-xl bg-white border">
                <p className="font-semibold text-3xl mb-3">
                    Sign up for <span className="text-blue-700 text-3xl font-bold tracking-widest">SENTINEL</span>
                </p>
                <section className="flex items-center justify-center">
                    <button type="button" onClick={() => { console.log("signup github trigger"); auth.githubRedirect() }} tabIndex={-1} className="mr-1 flex border border-black rounded-xl px-3 py-1.5">
                        <GithubIcon className="mr-2 w-6 h-6 overflow-visible" />
                        <span className="text-black tracking-wide font-semibold">Github</span>
                    </button>
                    <button type="button" onClick={() => { console.log("signup google trigger"); auth.googleRedirect() }} tabIndex={-1} className="ml-1 flex border border-orange-500 rounded-xl px-3 py-1.5">
                        <GoogleIcon className="mr-5 w-3 h-3 overflow-visible" />
                        <span className="text-black tracking-wide font-semibold">Google</span>
                    </button>
                </section>
                <section className="p-1">
                    or
                </section>
                {/* inputs */}
                <section className="flex flex-col w-full px-6 pt-2 ">
                    {/* username */}
                    <input id="username" type=" text" placeholder="Username" required value={values.username} onChange={handleChange} onBlur={handleBlur}
                        className={`${errors.username && touched.username ? "border-red-500" : ""} border-b focus:outline-blue-500 border-gray-300 mb-2 bg-gray-50  placeholder:text-gray-700 px-3 py-1.5 rounded-sm`} />
                    <span className="text-sm text-red-500">{errors.username && touched.username ? errors.username : ""}</span>
                    {/* email */}
                    <input id="email" type="email" placeholder="Email" required value={values.email} onChange={handleChange} onBlur={handleBlur}
                        className={`${errors.email && touched.email ? " border-red-500" : ""} border-b focus:outline-blue-500 border-gray-300 mb-2 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm`} />
                    <span className="text-sm text-red-500">{errors.email && touched.email ? errors.email : ""}</span>
                    {/* password */}
                    <input id="password" type="password" placeholder="Password" required value={values.password} onChange={handleChange} onBlur={handleBlur}
                        className={`${errors.password && touched.password ? " border-red-500" : ""} border-b focus:outline-blue-500 border-gray-300 mb-2 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm`} />
                    <span className="text-sm text-red-500">{errors.password && touched.password ? errors.password : ""}</span>
                    <span className="text-sm text-red-500">{!auth.status?.toLowerCase().includes("authorized") && auth.status ? auth.status : ""}</span>

                    {/* sign in */}
                    <button type="submit" className={`bg-blue-700 text-white rounded-md py-2 font-semibold tracking-wide 
                    flex items-center justify-center`} disabled={isSubmitting}>
                        Sign up {isSubmitting ? <LoadingSpinner className="ml-2 h-1.5 overflow-visible text-blue-400 -translate-y-2.5" /> : null}
                    </button>
                    <p onClick={() => navigate("/signin")} className="text-blue-600 mt-2 cursor-pointer">Already have an account? Sign in</p>
                    <p onClick={() => navigate("/forgot-password")} className="text-blue-600 cursor-pointer">Forgot your password?</p>
                </section>
            </form>
        </main >
    )
}

export default SignUp;