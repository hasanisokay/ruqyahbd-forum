'use server'
const getAdmins = async () => {
  try {
    const admin = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/admin/chatdata`,
      { cache: 'no-cache' }
    );
    const data = await admin.json();
    return data;
  } catch {
    return null;
  }
};

export default getAdmins;
