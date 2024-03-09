'use server'
import { headers } from "next/headers";
const getUserIp = async() => {
  // const response = await fetch("/api/getip");
  // const data = await response.json();
  // return data;
  const header = headers();
  const xForwardedFor = header.get("x-forwarded-for");
  let realIp = header.get("x-real-ip");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  if (realIp) return realIp.trim();
  return null;
};

export default getUserIp;
