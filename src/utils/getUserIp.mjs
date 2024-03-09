const getUserIp = async () => {
  const response = await fetch("/api/getip");
  const data = await response.json();
  return data;
};

export default getUserIp;
