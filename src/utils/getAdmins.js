const getAdmins = async () => {
  const admin = await fetch(`/api/admin/chatdata`, {cache:'no-cache'});
  const data = await admin.json();
  return data;
};

export default getAdmins;
