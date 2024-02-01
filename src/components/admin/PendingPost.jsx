'use client'
import { useRef, useContext, useState, useEffect } from 'react';
import Image from 'next/image'
import truncateText from '@/utils/trancatText';
import AuthContext from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import dynamic from 'next/dynamic';
import UserIcon from '@/components/SVG/UserIcon';

import handleToggleExpand from '@/utils/handleToggleExpand';
import ModalUser from '../ModalUser';
import handleShowLess from '@/utils/handleShowLess';
import changeStatus from '@/utils/changeStatus';
import handleApprovePost from '@/utils/handleApprovePost';
import handleDeclinePost from '@/utils/handleDeclinePost';
import { LoadingCards } from '../LoadingSkeletons/Loaders';

const PhotosInPost = dynamic(() => import('@/components/PhotosInPost'));

const PendingPost = () => {
    const { fetchedUser, onlineUsers, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails } = useContext(AuthContext);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const infiniteScrollRef = useRef();
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [posts, setPosts] = useState([])
    const [loadingPosts, setloadingPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false)
    const [size, setSize] = useState(0);
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        setPosts([]);
        setSize(0);
    };
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(searchText);
        setPosts([]);
        setSize(0);
    };
    const getPosts = async () => {
        setNoMorePosts(false)
        setloadingPosts(true)
        try {
            const params = new URLSearchParams();
            params.append('page', size + 1);
            params.append('sortOrder', sortOrder);
            params.append('searchTerm', searchTerm);
            const response = await fetch(`/api/posts/pendingposts?${params.toString()}`);
            const newData = await response.json();
            if (!newData) {
                return setError(true)
            }
            if (newData?.length < 1) {
                return setNoMorePosts(true);
            }
            setPosts((prev) => [...prev, ...newData])
        }
        catch {
            setError(true);
        }
        finally {
            setloadingPosts(false)
        }
    }
    useEffect(() => {
        if (posts?.length % 10 === 0) {
            getPosts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size, searchTerm, sortOrder])

    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled to the bottom
            if (
                infiniteScrollRef.current &&
                window.innerHeight + window.scrollY >= infiniteScrollRef.current.offsetTop
            ) {
                try {
                    if (error || noMorePosts) return;
                    setSize(size + 1);
                } catch {
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApproveAll = async () => {
        const dataToSend = { approveAll: true, actionBy: fetchedUser.username, }
        const data = await changeStatus(dataToSend);
        if (data?.status === 200) {
            toast.success(data.message)
        }
    }
    const handleDeclineAll = async () => {
        const dataToSend = { declineAll: true, actionBy: fetchedUser.username, }
        const data = await changeStatus(dataToSend);
        if (data?.status === 200) {
            toast.success(data.message)
        }
    }

    return (
        <div>
            {/* top form and other options */}
            <div className="my-4 gap-2 flex md:flex-row flex-col items-center justify-center">
                <label htmlFor="sortOrder" className="mr-2">
                    Sort By:
                </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="mr-4 rounded-md focus:outline-none outline-none"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        className='focus:outline-none rounded-md px-2'
                        placeholder="Search by username"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
            </div>
            <div className='flex gap-4 items-center justify-center'>
                {
                    posts?.length > 0 && <div className='text-center my-2'>
                        <button className='forum-btn1 greenbg' onClick={() => document.getElementById('approveAllModal').showModal()}>Approve All</button>
                    </div>
                }
                {
                    posts?.length > 0 && <div className='text-center my-2'>
                        <button className='forum-btn1 bg-red-500' onClick={() => document.getElementById('declineAllModal').showModal()}>Decline All</button>
                    </div>
                }
            </div>
            <dialog id="approveAllModal" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-lg">Sure to do this?</h3>
                    <button onClick={handleApproveAll} className='forum-btn1 greenbg text-white'>Yes, I want to approve all</button>
                </div>
                <form method="dialog" className="modal-backdrop cursor-default">
                    <button className='cursor-default'></button>
                </form>
            </dialog>

            <dialog id="declineAllModal" className="modal">
                <div className="modal-box text-center">
                    <h3 className="font-bold text-lg">Sure to do this?</h3>
                    <button onClick={handleDeclineAll} className='forum-btn1 bg-red-500'>Yes, I want to decline all</button>
                </div>
                <form method="dialog" className="modal-backdrop cursor-default">
                    <button className='cursor-default'></button>
                </form>
            </dialog>

            {/* top form and other options ends */}

            {searchTerm && !loadingPosts && posts?.length > 0 && <p className='text-center'>Showing posts by {searchTerm}</p>}
            {posts?.length > 0 && <p className='text-center'>Now showing {posts?.length} posts.</p>}
            {posts && posts?.map((post) => (
                <div key={post?._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome '>
                    <div className='flex gap-2 items-center'>
                        <div className='cursor-pointer' onClick={() => setSelectedUsernameToShowDetails(post?.author?.username)}>
                            {
                                post?.authorInfo?.photoURL ?
                                    <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                        width={64} height={0} priority={true}
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: '50%',
                                        }}
                                        className={`${onlineUsers?.includes(post?.author?.username) ? "online-border-color" : "offline-border-color"}`}
                                    />
                                    : <div className={`flex items-center justify-center rounded-full  w-[45px] h-[45px] ${onlineUsers?.includes(post?.author?.username) ? "online-border-color" : "offline-border-color"}`}>
                                        <UserIcon height={"35px"} width={"35px"} />

                                    </div>
                            }
                        </div>
                        <div className='py-2'>
                            {/* todo: fetch name with aggregate with username */}
                            <p className='font-semibold'>{post?.authorInfo?.name}</p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{post?.author?.username}</p>
                                <p className='' title={post.date}> {formatDateInAdmin(new Date(post.date))}</p>
                            </div>
                            <p className='text-xs'>Member since {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
                        </div>
                    </div>
                    <p className='whitespace-pre-wrap break-words'>{expandedPosts.includes(post?._id) ? post?.post : truncateText(post?.post)}
                        {!expandedPosts.includes(post._id) && post?.post?.length > 200 && (
                            <button onClick={() => handleToggleExpand(setExpandedPosts, post?._id)} className='text-xs font-semibold'>... Show more</button>
                        )}
                        {expandedPosts.includes(post?._id) && (
                            <button onClick={() => handleShowLess(setExpandedPosts, post?._id)} className='text-xs font-semibold pl-1'>Show less </button>
                        )}
                    </p>
                    {
                        post?.photos && <PhotosInPost photosArray={post?.photos} />
                    }
                    <div className='flex items-center gap-6 mt-1'>
                        <div className='flex items-center flex-col cursor-pointer' >
                            <span onClick={() => handleApprovePost({ actionBy: fetchedUser?.username, postAuthorUsername: post?.author?.username, postID: post?._id, action: "approve" }, setPosts)} className='forum-btn-sm2 hover:text-black greenbg lg:hover:bg-[#41925f]'> Approve</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <span onClick={() => handleDeclinePost({ actionBy: fetchedUser?.username, postAuthorUsername: post?.author?.username, postID: post?._id, action: "decline" }, setPosts)} className='forum-btn-sm2 hover:text-black bg-red-600 lg:hover:bg-red-900'> Decline</span>
                        </div>
                    </div>
                </div>
            ))}

            {loadingPosts && <div>
                <LoadingCards />
            </div>}
            {error && <p className='text-red-500'>Error Loading Posts. Please Reload</p>}
            {noMorePosts && searchTerm?.length === 0 && <div className='py-1 text-center'>
                No more posts
            </div>}
            {
                noMorePosts && searchTerm?.length > 0 && <div className='py-1 text-center'>
                    There is no pending post by {searchTerm}.
                </div>
            }
            {selectedUsernameToShowDetails && <ModalUser />}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default PendingPost;