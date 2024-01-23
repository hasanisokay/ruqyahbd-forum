'use client'
import AuthContext from '@/contexts/AuthContext';
import useTheme from '@/hooks/useTheme';
import createJWT from '@/utils/createJWT';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingLoginPage from './LoadingLoginPage';

const LoginForm = () => {
    const { signIn, loading, fetchedUser, setFetchedUser } = useContext(AuthContext);
    const [disableForm, setDisableForm] = useState(false);
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/";
    const router = useRouter();
    const { replace, refresh, push } = router;
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const inputClasses = `w-full p-2 border rounded-md focus:outline-none border-none focus:border-none ${theme === 'dark' ? 'bg-[#3d404a]' : 'bg-white'
        } `;
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({
            username: '',
            password: '',
        });
        if (!username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
            return
        }
        if (!password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
            return
        }
        try {
            setDisableForm(true)
            const toastId = toast.loading("Loading...");
            const res = await signIn(username, password, from)
            if (res.status === 404) {
                toast.dismiss(toastId);
                toast.error(res.message)
            }
            else {
                const { username, email, isAdmin } = res;
                await createJWT({ username, email, isAdmin })
                setFetchedUser(res)
                startTransition(() => {
                    refresh()
                    push(from);
                });
                toast.dismiss(toastId);
                toast.success("Success");
            }
            setDisableForm(false)

        } catch (error) {
            console.error('Error while login: ', error.message);
            return false;
        }
    };
if(!fetchedUser && loading) return <LoadingLoginPage />
if(fetchedUser) return push("/")
   if(!fetchedUser && !loading) return (
        <>
            <form
                onSubmit={handleSubmit}
                className={`lg:w-[40vw] md:w-[80vw] w-[90vw] mx-auto mt-4 p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-[#282a37]' : 'bg-[#f0f1f3]'} ${disableForm ? "opacity-50" : "opacity-100"}`}
            >
                <h1 className='text-xl text-center font-semibold'>Welcome Back!</h1>
                <p className='text-center text-xs mt-2'>Login to your account</p>
                <label htmlFor="username" className="block mt-4 mb-2 dark:text-[#999da7] ">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    disabled={disableForm}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${inputClasses}`}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}


                <label htmlFor="password" className="block mt-4 mb-2 dark:text-[#999da7]">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    disabled={disableForm}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClasses}`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <button
                    type="submit" disabled={disableForm}
                    className={`mt-6 w-full text-white p-2 rounded-md ${disableForm ? "bg-slate-400" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                    Log In
                </button>
                <div className='my-2  dark:text-[#999da7]'>
                    <p className='text-sm'>Don&apos;t have an account? Please <button onClick={() => router.push("/signup")} title='goto signup' className='text-blue-600'>Sign Up</button>.</p>
                    <p className='text-sm mt-2'>Forgotten password? <button onClick={() => router.push("/identity")} title='goto reset password' className='text-blue-600'>Reset Password</button>.</p>
                </div>
            </form>
        </>
    );
};

export default LoginForm;
