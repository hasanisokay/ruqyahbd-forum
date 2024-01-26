'use server'
const getMetaData = async (url) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/getmetadata?url=${url}`);
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};

export default getMetaData;
