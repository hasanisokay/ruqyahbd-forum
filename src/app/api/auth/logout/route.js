import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
export const GET = async (request) => {
  const res = new NextResponse(
    JSON.stringify({
      message: "successfully logged out",
    })
  );
  cookies().delete(COOKIE_NAME);
  // res.cookies.delete(COOKIE_NAME);
  return res;
};
