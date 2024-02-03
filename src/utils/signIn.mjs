'use server'
const signIn = async (username, password) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
}
export default signIn;