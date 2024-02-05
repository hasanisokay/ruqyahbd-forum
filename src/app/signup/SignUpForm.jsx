'use client'
import AuthContext from '@/contexts/AuthContext';
import useTheme from '@/hooks/useTheme';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import LoadingSignUpPage from './LoadingSignUpPage';
import createJWT from '@/utils/createJWT';
import "@/../css/formstyles.css"
import signIn from '@/utils/signIn.mjs';
import isValidEmail from '@/utils/isValidEmail.mjs';
const SignUpForm = () => {

  const { fetchedUser, setFetchedUser } = useContext(AuthContext)
  const search = useSearchParams();
  const from = search.get("redirectUrl") || "/";

  const [isPending, startTransition] = useTransition()
  const { refresh, push } = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [gender, setGender] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    retypePassword: '',
    gender: '',
  });
  useEffect(() => {
    if (fetchedUser) {
      startTransition(() => {
        refresh()
        push(from);
      });
    }
  }, [fetchedUser, from, push, refresh,]);
  function formatDate() {
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short',
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date());
    return formattedDate;
  }

  const checkUsernameAvailability = async (newUsername) => {
    try {
      const response = await fetch(`/api/auth/username?username=${newUsername}`);
      const data = await response.json();
      return data.available; // Assuming your API returns an object with a boolean property 'available'
    } catch (error) {
      console.error('Error checking username availability:', error.message);
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      retypePassword: '',
      gender: '',
    });

    if (!name || name.length < 3) {
      return setErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
    }
    if (name.length < 3) {
      return setErrors((prevErrors) => ({ ...prevErrors, name: 'Name length should be at least 3' }));
    }

    if (!username) {
      return setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
    }
    if (username.length < 3) {
      return setErrors((prevErrors) => ({ ...prevErrors, username: 'Username should be at least 3 character long' }));
    }
    if (!isValidEmail(email)) {
      return setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is not valid' }));
    }
    if (!isUsernameAvailable) {
      return
    }
    if (!gender) {
      return setErrors((prevErrors) => ({ ...prevErrors, gender: 'Gender is required' }));
    }
    if (!password) {
      return setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
    }
    if (password !== retypePassword) {
      return setErrors((prevErrors) => ({ ...prevErrors, retypePassword: 'Passwords do not match' }));
    }

    const toastId = toast.loading("Loading...");
    try {
      await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, phone, password, gender, photoURL: "", joined: formatDate() }),
      });
      const res = await signIn(username, password, from)
      if (res.status === 404) {
        return toast.error(res.message)
      }
      else {
        const { username, email, isAdmin } = res;
        await createJWT({ username, email, isAdmin })
        setFetchedUser(res)
        toast.success("Success");
      }
    } catch (error) {
      console.error('Error while sign up: ', error.message);
      return false;
    }
    finally {
      toast.dismiss(toastId)
    }
  };
  const handleUsernameOnchange = (e) => {
    if (errors.username.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
    }
    setUsername(e.target.value.toLowerCase());
  }
  const handleNameOnchange = (e) => {
    if (errors.name.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    }
    setName(e.target.value);
  }
  const handleEmailOnchange = (e) => {
    if (errors.email.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
    setEmail(e.target.value);
  }
  const handlePhoneOnchange = (e) => {
    if (errors.phone.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
    }
    setPhone(e.target.value);
  }
  const handleGenderOnchange = (e) => {
    if (errors.gender.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));
    }
    setGender(e.target.value);
  }
  const handlePasswordOnchange = (e) => {
    if (errors.password.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
    setPassword(e.target.value);
  }
  const handleRetypePasswordOnchange = (e) => {
    if (errors.retypePassword.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, retypePassword: '' }));
    }
    setRetypePassword(e.target.value);
  }
  useEffect(() => {
    const checkAvailability = async () => {
      if (username?.length > 3) {
        setUsernameChecking(true)
        const available = await checkUsernameAvailability(username);
        setUsernameChecking(false);
        setIsUsernameAvailable(available);
      }
    };

    // Delay the check to avoid too many requests while typing
    const timeoutId = setTimeout(checkAvailability, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  if (isPending) {
    return <LoadingSignUpPage />
  }
  if (!fetchedUser && !isPending) {
    return (
      <div className='form-container'>
        <div className={`form-div form-div-signup ${(username !== "" || password !== "" || name !== "" || email !== "" || password !== "" || retypePassword !== "" || gender !== "" || phone !== "") && "login-animation"}`}>
          <form
            onSubmit={handleSubmit}
            className={`gradient-bg  z-20 ${theme === 'dark' ? 'bg-[#282a37]' : 'bg-[#f0f1f3]'}`}
          >
            <h1 className='text-xl text-center font-semibold'>Create New Account</h1>
            <p className='text-center text-xs mt-2'>Begin Your Sign-Up Process</p>
            <label htmlFor="name" className="block mt-4 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameOnchange(e)}
              className="form-input"
            />
            {errors.name && <p className="errors">{errors.name}</p>}
            {!errors.name && name != "" && name.length < 3 && <p className="errors">{"Name should be at least 3 character long"}</p>}
            <label htmlFor="username" className="block mt-4 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleUsernameOnchange(e)}
              className={`form-input ${username !== "" && (isUsernameAvailable ? 'focus:border-blue-500' : 'border-red-500')
                }`}
            />
            {
              usernameChecking ? <p className="text-sm text-black">Checking availability <span className="loading loading-spinner loading-xs"></span></p> : (
                !isUsernameAvailable && username.length > 3 && (
                  <p className="errors">{username} is not available. Try another.</p>
                ) || isUsernameAvailable && username?.length > 2 && (
                  <p className="text-green-500 text-sm">{username} is available.</p>
                ))
            }
            {errors.username && <p className="errors">{errors.username}</p>}

            <label htmlFor="email" className="block mt-4 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => handleEmailOnchange(e)}
              className="form-input"
            />
            {errors.email && <p className="errors">{errors.email}</p>}

            <label htmlFor="phone" className="block mt-4 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => handlePhoneOnchange(e)}
              className="form-input"
            />
            {errors.phone && <p className="errors">{errors.phone}</p>}

            <label htmlFor="gender" className="block mt-4 mb-2">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => handleGenderOnchange(e)}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="errors">{errors.gender}</p>}

            <label htmlFor="password" className="block mt-4 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handlePasswordOnchange(e)}
              className="form-input"
            />
            {errors.password && <p className="errors">{errors.password}</p>}

            <label htmlFor="retypePassword" className="block mt-4 mb-2">
              Retype Password
            </label>
            <input
              type="password"
              id="retypePassword"
              value={retypePassword}
              onChange={(e) => handleRetypePasswordOnchange(e)}
              className="form-input"
            />
            {errors.retypePassword && (
              <p className="errors">{errors.retypePassword}</p>
            )}

            <button
              type="submit"
              className="btn-green btn-green-active"
            >
              Sign Up
            </button>
            <p className='text-sm'>Already have an account? Please <button onClick={() => push("/login")} title='goto login' className='text-blue-800 font-semibold dark:text-blue-500'>login</button>.</p>
          </form>
        </div>
      </div>
    );
  }
};

export default SignUpForm;
