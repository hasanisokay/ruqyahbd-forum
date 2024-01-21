"use server";
const getStats = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/getstat`,
    { cache: "no-store" }
  );
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
