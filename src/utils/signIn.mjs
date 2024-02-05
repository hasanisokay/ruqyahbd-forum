const signIn = async (username, password, from) => {
    const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, from }),
    });
    const data = await response.json();
    return data;
}
export default signIn