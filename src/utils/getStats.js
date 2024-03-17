'use server'
const getStats = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/getstat?${timestamp}`,
      {cache:'no-cache'}
    );
    const jsonData = await response.json();
    return jsonData;
  } catch {
    return null;
  }
};

export default getStats;
