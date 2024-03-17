'use server'
const getAdmins = async () => {
  try {
    const timestamp = new Date().getTime();
    const admin = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/admin/chatdata?${timestamp}`,
      {next:{ revalidate: 300} }
    );
    const data = await admin.json();
    return data;
  } catch {
    return null;
  }
};

export default getAdmins;
