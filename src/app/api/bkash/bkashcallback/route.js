export const GET = async (request) => {
  const paymentID = request.nextUrl.searchParams.get("paymentID");
  const status = request.nextUrl.searchParams.get("status");

  if(status==="cancel" || status==="failure"){
    
  }
};
