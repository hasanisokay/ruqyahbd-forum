const logOut = async (setFetchedUser, setLoading, setLoggedOut) => {
    setLoading(true);
    const response = await fetch(`/api/auth/logout`);
    const data = await response.json();
    setFetchedUser(null)
    // toast.success(data.message)
    setLoggedOut(true)
    setLoading(false);
} 
export default logOut;