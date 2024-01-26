import dynamic from "next/dynamic";
const PostStat = dynamic(() => import('./PostStat'));
const  AdminsStat = dynamic(() => import('./AdminsStat'));
const  DeveloperContact = dynamic(() => import('./DeveloperContact'));
const  OnlineUsersCounter = dynamic(() => import('./OnlineUsersCounter'));

const Stats = () => {
    return (
        <div className="mb-10">
            <OnlineUsersCounter />
            <PostStat />
            <div className="bg-[#fffef9] shadow-xl dark:bg-[#242526] cardinhome py-4 min-h-[300px]  ">
                <AdminsStat />
            </div>
            <DeveloperContact />
        </div>
    );
};

export default Stats;