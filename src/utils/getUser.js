
const getUser = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/me`, { next: { revalidate: 60 } })
        const data = await response.json();
        return {
            user: data,
        }
    }
    catch (error) {
        return {
            user: null,
        }
    }
};

export default getUser;