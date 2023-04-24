import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

function LoginForm() {
    const navigate = useNavigate();
    const user = useUserStore();
    // const isLoggedIn = localStorage.getItem("token");
    const { values, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: (values, form) => {
            user.login(values, navigate);
            form.resetForm();
        },
    })
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center justify-center p-4 text-white">
            <input id="username" type="text" placeholder="Username" value={values.username} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md p-2' />
            <input id="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} className='bg-gray-700 rounded-md  p-2' />
            <button type="submit" disabled={isSubmitting} onChange={handleChange} onBlur={handleBlur} className='text-white bg-sky-700 rounded-md  p-2 px-6'>Login</button>
        </form>
    )
}

export default LoginForm