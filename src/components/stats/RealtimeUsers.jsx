'use server'
import AdminsStat from "./AdminsStat";
import OnlineUsers from "./OnlineUsers";

const RealtimeUsers = ({allAdmins}) => {

    return (
        <div>
            {allAdmins && <AdminsStat allAdmins={allAdmins} />}
            <OnlineUsers />
        </div>
    );
};

export default RealtimeUsers;