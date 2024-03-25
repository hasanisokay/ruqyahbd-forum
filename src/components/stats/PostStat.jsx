'use server'
import getStats from '@/utils/getStats';

const PostStat = async () => {

    const stats = await getStats();
    
    return (
        <div >
            <div className='flex flex-col items-center justify-center my-4 py-4 bg-[#fffef9] cardinhome shadow-xl dark:bg-[#242526]'>
                <h1 className='statsHeaderTitle'>Post Stats</h1>
                <div>
                    <p>Pending: <span className='font-semibold'>{stats?.totalPendingPosts}</span></p>
                    <p>Approved: <span className='font-semibold'>{stats?.totalApprovedPosts}</span></p>
                    <p>Declined: <span className='font-semibold'>{stats?.totalDeclinedPosts}</span></p>
                    <p>Notices: <span className='font-semibold'>{stats?.totalNoticesCount}</span></p>
                </div>
            </div>
            <div className='flex cardinhome flex-col items-center justify-center my-4 py-4 bg-[#fffef9] shadow-xl dark:bg-[#242526]'>
                <h1 className='statsHeaderTitle'>User Stats</h1>
                <div>
                    <p>Total Users: <span className='font-semibold'>{stats?.totalUsersCount}</span></p>
                    <p>Admins: <span className='font-semibold'>{stats?.totalAdminCount}</span></p>
                </div>
            </div>
        </div>
    );
};

export default PostStat;