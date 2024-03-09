'use server'
import PostStat from "./PostStat";
import DeveloperContact from "./DeveloperContact";
import RealtimeUsers from "./RealtimeUsers";
import getAdmins from "@/utils/getAdmins";
import Footer from "./Footer";

const Stats = async () => {
    const allAdmins = await getAdmins();
    return (
        <>
            <PostStat />
            <RealtimeUsers allAdmins={allAdmins} />
            <DeveloperContact />
            <Footer />
        </>
    );
};

export default Stats;