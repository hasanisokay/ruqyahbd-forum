'use server'
const createJWT = async (payload) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export default createJWT;