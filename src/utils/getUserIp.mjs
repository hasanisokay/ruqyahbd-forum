import { headers } from "next/headers";

const getUserIp = async () => {
  // const response = await fetch("/api/getip");
  // const data = await response.json();
  // return data;
  const header = headers()
  const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
 return ip;
};

export default getUserIp;
