import { NextResponse } from "next/server";
export const GET = async (request) => {
try{
  const ipAddres = request.headers.get('x-forwarded-for') 
  return NextResponse.json({ip:ipAddres})

}
catch{
  return NextResponse.json({message:"Error", status:400})
}
};
