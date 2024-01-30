import toast from "react-hot-toast";

const changeStatus = async (dataToSend) => {
    const toastID = toast.loading("Please wait...")
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/posts/changestatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const data = await response.json();
    if (data.status === 200) {
      toast.success(data.message);
    }
    return data;
  } catch {
    toast.error("Internal Server Error. Please try again");
    return null;
  }
  finally{
    toast.dismiss(toastID)
  }
};

export default changeStatus;
