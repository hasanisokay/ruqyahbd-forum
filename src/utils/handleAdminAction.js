import toast from "react-hot-toast";

const handleAdminAction = async (username, action, adminUsername) => {
    if (!adminUsername) {
        return toast.error("Unauthorized");
    }

    try {
        const response = await fetch("/api/admin/changeuserrole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, action, actionBy: adminUsername }),
        });

        if (response.ok) {
            const data = await response.json();
            toast.success(data.message);
        } else {
            const data = await response.json();
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Error while handling admin action:", error);
        toast.error("An error occurred while performing the admin action");
    }
};

export default handleAdminAction;
