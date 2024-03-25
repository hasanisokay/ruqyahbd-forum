'use client'
import AuthContext from '@/contexts/AuthContext';
import useTheme from '@/hooks/useTheme';
import createJWT from '@/utils/createJWT';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UserIcon from '@/components/SVG/UserIcon';
import LoadingSpinner from '@/components/LoadingSkeletons/LoadingSpinner';
import "@/../css/formstyles.css";
import signIn from '@/utils/signIn.mjs';


const LoginForm = () => {
    const { loading, fetchedUser, setFetchedUser } = useContext(AuthContext);
    const [disableForm, setDisableForm] = useState(false);
    const search = useSearchParams();
    const from = search.get("redirectUrl") || "/";
    const router = useRouter();
    const { refresh, push } = router;
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });
    const handleUsernameOnchange = (e) => {
        // e.preventDefault();
        if (errors.username.length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
        setUsername(e.target.value);
    }
    const handelPasswordOnchange = (e) => {
        if (errors.password.length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
        setPassword(e.target.value);
    }

    useEffect(() => {
        if (fetchedUser) {
            startTransition(() => {
                refresh()
                push(from);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedUser])

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
        const toastId = toast.loading("Loading...");
        try {
            setDisableForm(true)
            const res = await signIn(username, password, from)
            if (res.status === 404) {
                return toast.error(res.message)
            }
            else {
                const { username, email, isAdmin } = res;
                await createJWT({ username, email, isAdmin })
                setFetchedUser(res)
            }
        } catch (error) {
            console.error('Error while login: ', error.message);
            return false;
        }
        finally {
            toast.dismiss(toastId)
            setDisableForm(false)
        }
    };
    if (!fetchedUser && loading) return <LoadingSpinner />
    if (fetchedUser) return push(from)
    if (!fetchedUser && !loading) return (
        // min-h-[calc(100dvh-58.2px]
        <div className='form-container'>
            <div className={`form-div form-div-login ${(username !== "" || password !== "") && !disableForm && "login-animation"}`}>
                <form
                    onSubmit={handleSubmit}
                    className={`gradient-bg  z-20  ${theme === 'dark' ? 'bg-[#282a37]' : 'bg-[#f0f1f3]'} ${disableForm ? "opacity-50" : "opacity-100"}`}
                >
                    <div className='flex items-center justify-center'>
                        <UserIcon height={"50px"} width={"50px"} />
                    </div>
                    <h1 className='text-xl text-center font-semibold'>Welcome Back!</h1>
                    <p className='text-center text-xs mt-2'>Login to your account</p>
                    <label htmlFor="username" className="block mt-4 mb-2 ">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        disabled={disableForm}
                        value={username}
                        onChange={(e) => handleUsernameOnchange(e)}
                        className={`form-input`}
                    />
                    {errors.username && <p className="errors">{errors.username}</p>}


                    <label htmlFor="password" className="block mt-4 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        disabled={disableForm}
                        onChange={(e) => handelPasswordOnchange(e)}
                        className={`form-input`}
                    />
                    {errors.password && <p className="errors">{errors.password}</p>}

                    <button
                        type="submit" disabled={disableForm}
                        className={`btn-green ${disableForm ? "btn-green-disabled" : "btn-green-active "}`}
                    >
                        Log In
                    </button>
                    <div className='mt-2'>
                        <p className='text-sm'>Don&apos;t have an account? Please <button onClick={() => router.push("/signup")} title='goto signup' className='text-blue-800 font-semibold dark:text-blue-500'>Sign Up</button></p>
                        <p className='text-sm mt-2'>Forgotten password? <button onClick={() => router.push("/identity")} title='goto reset password' className='text-blue-800 font-semibold dark:text-blue-500'>Reset Password</button></p>
                    </div>
                </form>

            </div>
        </div>
    );
};
export default LoginForm;
