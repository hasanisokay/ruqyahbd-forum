'use server'
const getStats = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/getstat`);
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
