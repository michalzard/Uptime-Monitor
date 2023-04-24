import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../../store/userStore';

function RegisterForm() {
    const navigate = useNavigate();
    const user = useUserStore();
    const { values, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        onSubmit: (values, form) => {
            user.register(values, navigate);
            form.resetForm();
        }
    });
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center p-4 text-white">
            <input id="username" type="text" placeholder="Username" value={values.username} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md p-2' />
            <input id="email" type="email" placeholder="example@gmail.com" value={values.email} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md  p-2' />
            <input id="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md  p-2' />
            <button type="submit" disabled={isSubmitting} onChange={handleChange} onBlur={handleBlur} className='text-white bg-sky-700 rounded-md  p-2 px-6'>Register</button>
        </form>
    )
}

export default RegisterForm