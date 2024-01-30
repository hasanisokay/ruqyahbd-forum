'use client'
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import truncateText from '@/utils/trancatText';
import AuthContext from '@/contexts/AuthContext';
import { useRef, useContext, useState, useEffect } from 'react';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import PhotosInPost from '@/components/PhotosInPost';
import UserIcon from '@/components/SVG/UserIcon';
import LoadingCards from '../LoadingCards';
import handleShowLess from '@/utils/handleShowLess';
import handleToggleExpand from '@/utils/handleToggleExpand';
import changeStatus from '@/utils/changeStatus';
import handleApprovePost from '@/utils/handleApprovePost';

const DeclinedPosts = () => {
    const { fetchedUser, onlineUsers } = useContext(AuthContext);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order is descending
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [error, setError] = useState(null);
    const infiniteScrollRef = useRef();
    const [posts, setPosts] = useState([])
    const [loadingPosts, setloadingPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false)
    const [size, setSize] = useState(0);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const getPosts = async () => {
        setNoMorePosts(false)
        try {
            const params = new URLSearchParams();
            params.append('page', size + 1);
            params.append('sortOrder', sortOrder);
            params.append('searchTerm', searchTerm);
            const response = await fetch(`/api/admin/declinedposts?${params.toString()}`);
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

    const handleDeletePermanently = async (id, username,) => {
        const dataToSend = { actionBy: fetchedUser.name, postAuthorUsername: username, postID: id, action: "delete" }
        await changeStatus(dataToSend)
    }
    const handleDeleteAll = async () => {
        const dataToSend = { deleteAll: true, actionBy: fetchedUser?.name }
        await changeStatus(dataToSend)
    }

    return (
        <div>
            <div className="my-4 flex flex-col md:flex-row gap-2 items-center justify-center">
                <label htmlFor="sortOrder" className="mr-2">
                    Sort By:
                </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="mr-4"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
                <form onSubmit={() => setSearchTerm(searchText)}>
                    <input
                        type="text"
                        className='rounded-lg focus:outline-none'
                        placeholder="Search by username"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>

                {
                    posts?.length > 0 && <div className='text-center my-2 ml-1 '>
                        <button className='forum-btn1 bg-red-600' onClick={() => document.getElementById('my_modal_2').showModal()}>Delete All Permanently</button>
                    </div>
                }
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box text-center">
                        <h3 className="font-bold text-lg">Sure to do this?</h3>
                        <button onClick={handleDeleteAll} className='forum-btn1 bg-red-600'>Yes, I want to delete all</button>
                    </div>
                    <form method="dialog" className="modal-backdrop cursor-default">
                        <button className='cursor-default'></button>
                    </form>
                </dialog>
            </div>
            <div>
                {posts?.map((post) => (
                    <div key={post?._id} className='p-2 cursor-default border-2 m-2 rounded-lg dark:border-gray-400 cardinhome'>
                        <div className='flex gap-2 items-center'>
                            <div>
                                {
                                    post?.authorInfo?.photoURL ?
                                        <Image src={post?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                            width={64} height={0}
                                            priority={true}
                                            style={{
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: '50%',
                                            }}
                                            className={` ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}
                                        />
                                        : <div className={`flex items-center justify-center rounded-full w-[45px] h-[45px] ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}>
                                            <UserIcon height={"35px"} width={"35px"} />
                                        </div>
                                }
                            </div>
                            <div className='py-2'>
                                <p className='font-semibold'>{post?.authorInfo?.name}</p>
                                <div className='text-xs flex gap-2 items-center'>
                                    <p className=''>@{post?.authorInfo?.username}</p>
                                    <p className='' title={post?.date}>Post Date: {formatDateInAdmin(new Date(post?.date))}</p>
                                </div>
                                <p className='text-xs'> Declined By: {post?.declinedBy || "n/a"}</p>
                                <p className='text-xs'> Declined Date: {formatDateInAdmin(new Date(post?.declineDate))}</p>
                            </div>
                        </div>
                        <p className='whitespace-pre-wrap break-words'>{expandedPosts.includes(post?._id) ? post?.post : truncateText(post?.post)}
                            {!expandedPosts.includes(post._id) && post?.post?.length > 200 && (
                                <button onClick={() => handleToggleExpand(setExpandedPosts, post?._id)} className='text-xs font-semibold'>... Show more</button>
                            )}
                            {expandedPosts.includes(post._id) && (
                                <button onClick={() => handleShowLess(setExpandedPosts, post?._id)} className='text-xs font-semibold pl-1'>Show less </button>
                            )}
                        </p>
                        {
                            post?.photos && < PhotosInPost photosArray={post?.photos} />
                        }
                        <div className='flex items-center gap-6 mt-2'>
                            <div className='flex items-center flex-col cursor-pointer' >
                                <span onClick={() => handleApprovePost({actionBy: fetchedUser?.name, postAuthorUsername: post?.authorInfo?.username, postID: post?._id, action: "approve", updateActivityLogID: true }, null)} className='forum-btn1 greenbg lg:hover:bg-[#45a167]'> Approve</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <span onClick={() => handleDeletePermanently(post?._id, post?.authorInof?.username)} className='forum-btn1 bg-red-500 lg:hover:bg-red-600'> Delete Permanently</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {loadingPosts && <LoadingCards />}

            {size > 0 && !isValidating && (data && (data[size - 1]?.length == undefined || data[size - 1]?.length === 0)) && (
                <div className='py-1 text-center'>
                    No more declined posts
                </div>
            )}

            {/* Infinite scrolling trigger */}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </div>
    );
};

export default DeclinedPosts;
