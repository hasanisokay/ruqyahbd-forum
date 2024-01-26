"use server"
const getAdmins = async () => {
  const admin = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/admin/chatdata`, {cache:'no-store'});
  const data = await admin.json();
  return data;
};

export default getAdmins;
