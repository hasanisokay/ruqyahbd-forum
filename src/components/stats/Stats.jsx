'use server'
import PostStat from "./PostStat";
import DeveloperContact from "./DeveloperContact";
import RealtimeUsers from "./RealtimeUsers";
import getAdmins from "@/utils/getAdmins";

const Stats = async () => {
    const allAdmins = await getAdmins();
    return (
        <div className="mb-10">
            <PostStat />
            <RealtimeUsers allAdmins={allAdmins}/>
            <DeveloperContact />
        </div>
    );
};

export default Stats;