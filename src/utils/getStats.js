"use server";
const getStats = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/getstat`,
      { cache: "no-store" }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch {
    return null;
  }
};

export default getStats;
