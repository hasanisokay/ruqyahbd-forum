'use client'
import React, { useRef, useContext, useState, useEffect } from 'react';
import Image from 'next/image'
import AuthContext from '@/contexts/AuthContext';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import UserIcon from '@/components/SVG/UserIcon';
import ModalUser from '../ModalUser';

import handleApprovePost from '@/utils/handleApprovePost';
import { LoadingCards } from '../LoadingSkeletons/Loaders';

const AdminActivity = () => {
    const { fetchedUser, onlineUsers, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails } = useContext(AuthContext);
    const [actionFilter, setActionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const [postTextForModal, setPostTextForModal] = useState("")
    const [posts, setPosts] = useState([])
    const [loadingPosts, setloadingPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false)
    const [size, setSize] = useState(0);
    const [error, setError] = useState(null)
    const infiniteScrollRef = useRef();

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(searchText);
        setPosts([]);
        setSize(0);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        setPosts([]);
        setSize(0);
    };
    const handleActionFilterChange = (event) => {
        setActionFilter(event.target.value);
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
            params.append('actionFilter', actionFilter);
            const response = await fetch(`/api/admin/adminactivity?${params.toString()}`, {cache: 'no-store'});
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
            setloadingPosts(false);
        }
    }
    useEffect(() => {
        if (posts?.length % 10 === 0) {
            getPosts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size, searchTerm, sortOrder, actionFilter])

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
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="my-4 flex items-center justify-center">
                <label htmlFor="sortOrder" className="mr-2">
                    Sort By:
                </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="mr-4 outline-none rounded-md"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
                <select
                    id="actionFilter"
                    value={actionFilter}
                    onChange={handleActionFilterChange}
                    className="mr-4 outline-none rounded-md"
                >
                    <option value="">All Actions</option>
                    <option value="approve">Approved</option>
                    <option value="decline">Declined</option>
                </select>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        className='rounded-md outline-none px-2'
                        placeholder="Search by username"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
            </div>
            {posts?.length > 0 && <p className='text-center'>Now showing {posts?.length} items.</p>}
            {posts && posts?.map((post) => (
                <div key={post?._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome '>
                    <div className='flex gap-2 items-center'>
                        <div className='cursor-pointer' onClick={() => setSelectedUsernameToShowDetails(post?.postAuthorUsername)}>
                            {
                                post?.authorInfo.photoURL ?
                                    <Image src={post?.authorInfo.photoURL} blurDataURL='' alt='User Profile Photo'
                                        width={64} height={0} priority={true}
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: '50%',
                                        }}
                                        className={` ${onlineUsers?.includes(post?.postAuthorUsername) ? "online-border-color" : "offline-border-color"}`}
                                    />
                                    : <div className={`flex items-center justify-center rounded-full  w-[45px] h-[45px]  ${onlineUsers?.includes(post?.postAuthorUsername) ? "online-border-color" : "offline-border-color"}`}>
                                        <UserIcon height={"35px"} width={"35px"} />
                                    </div>
                            }
                        </div>
                        <div className='py-2'>
                            <p className={`font-semibold ${post.action === "approve" ? "text-[#308853]" : "text-red-600"}`}><span className='capitalize'>{post?.action}</span>d</p>
                            <p className='font-semibold'>Author: {post?.authorInfo.name}</p>
                            <p className='font-semibold'>Author Username : {post?.postAuthorUsername}</p>
                            {
                                post?.approvedBy && <p className='font-semibold'> Approved by: {post?.approvedBy}</p>
                            }
                            {
                                post?.declinedBy && <p className='font-semibold'>Declined by: {post?.declinedBy}</p>
                            }
                            {
                                post?.declinedBy && <div className='flex gap-4'>

                                    <button className='btn-green-active p-1 rounded-md text-[10px]' onClick={() => handleApprovePost({ actionBy: fetchedUser?.username, postAuthorUsername: post?.author?.username, postID: post?.postID, action: "approve", updateActivityLogID: post?._id }, null)}>Approve</button>
                                </div>
                            }
                            <p className='font-semibold'>Action Date: {formatDateInAdmin(new Date(post?.timestamp))}</p>
                            {
                                post?.postID && post?.action === "approve" && <button className='text-[10px] btn-blue' onClick={() => router.push(`/${post.postID}`)}>Go to post</button>
                            }
                        </div>
                    </div>
                </div>
            ))}


            {loadingPosts && <div>
                <LoadingCards />
            </div>}
            {error && <p className='text-red-500'>Error Loading Posts. Please Reload</p>}
            {noMorePosts && searchTerm?.length === 0 && <div className='py-1 text-center'>
                No more activity
            </div>}
            {
                noMorePosts && searchTerm?.length > 0 && <div className='py-1 text-center'>
                    There is no history by {searchTerm}.
                </div>
            }
            {selectedUsernameToShowDetails && <ModalUser />}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default AdminActivity;