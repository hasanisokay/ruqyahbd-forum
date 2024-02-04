const createJWT = async (payload) => {
    try {
      const res = await fetch(`/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export default createJWT;