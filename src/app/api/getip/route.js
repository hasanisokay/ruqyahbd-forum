import { NextResponse } from "next/server";
export const GET = async (request) => {
try{
  const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  return NextResponse.json({ip: ipAddress})

}
catch{
  return NextResponse.json({message:"Error", status:400})
}
};
