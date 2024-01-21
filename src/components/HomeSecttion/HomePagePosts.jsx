'use client'
import formatRelativeDate from '@/utils/formatDate';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRef, useContext, useState, useEffect } from 'react';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import Image from 'next/image'
import { FaUserLarge, FaHeart } from "react-icons/fa6"
import AuthContext from '@/contexts/AuthContext';
import LoadingCards from '../LoadingCards';
import truncateText from '@/utils/trancatText';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import axios from 'axios';
import toast from 'react-hot-toast';
import ModalUser from '../ModalUser';
import LikersModal from '../LikersModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import PhotosInPost from '../PhotosInPost';
import VideosInPost from '../video-components/VideosInPost';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Link from 'next/link';
import copyToClipboard from '@/utils/copyToClipboard';
import ReportModal from '../ReportModal';
import getPosts from '@/utils/getPosts';
import makeUrlsClickable from '@/utils/makeUrlsClickable';
import LinkPreview from '../LinkPreview';
import useTheme from '@/hooks/useTheme';

const HomePagePosts = ({ tenPostsArray }) => {
    const { fetchedUser, showDeleteModal, setShowDeleteModal, showReportModal, setShowReportModal } = useContext(AuthContext);
    const infiniteScrollRef = useRef();
    const { theme } = useTheme();
    const [selectedPostIdForOptions, setSelectedPostIdForOptions] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [selectedUsernameToShowDetails, setSelectedUsernameToShowDetails] = useState(null)
    const [likersArray, setLikersArray] = useState(null);
    const [postIdToReport, setPostIdToReport] = useState(null);
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const [size, setSize] = useState(1)
    const [posts, setPosts] = useState(tenPostsArray);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [error, setError] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            if (
                infiniteScrollRef.current &&
                window.innerHeight + window.scrollY >= infiniteScrollRef.current.offsetTop
            ) {
                if (size * 10 === posts?.length) {
                    setSize(size + 1);
                    return;
                }
                else if (size * 10 < posts?.length) return setNoMorePosts(true);
                else setNoMorePosts(true)
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [size, posts]);


    useEffect(() => {
        if (size < 2) return;
        (async () => {
            setLoadingPosts(true);
            const data = await getPosts(size);
            setLoadingPosts(false)
            if (data?.message) {
                return setError(true);
            }
            else {
                setError(false);
                setPosts((prev) => [...prev, ...data])
            }
        })()
    }, [size])


    const handleToggleExpand = (postId) => {
        setExpandedPosts((prevExpandedPosts) => {
            if (prevExpandedPosts.includes(postId)) {
                // Post is expanded, so collapse it
                return prevExpandedPosts.filter((id) => id !== postId);
            } else {
                // Post is collapsed, so expand it
                return [...prevExpandedPosts, postId];
            }
        });
    };
    const handleShowLess = (postId) => {
        setExpandedPosts((prevExpandedPosts) => prevExpandedPosts.filter((id) => id !== postId));
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                selectedPostIdForOptions &&
                !event.target.closest('.relative') &&
                event.target !== infiniteScrollRef.current
            ) {
                // Clicked outside the options, hide them
                setSelectedPostIdForOptions(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [selectedPostIdForOptions]);



    const handleShowUser = (username) => {
        setSelectedUsernameToShowDetails(username);
    }

    useEffect(() => {
        if (selectedUsernameToShowDetails) {
            document.getElementById('userModal').showModal();
        }
    }, [selectedUsernameToShowDetails]);

    useEffect(() => {
        if (likersArray) {
            document.getElementById('likerModal').click();
        }
    }, [likersArray]);


    const handleDislike = async (id) => {
        if (!fetchedUser) {
            return toast.error("Log in to react")
        }
        const dataToSend = {
            postID: id, action: "dislike", actionByUsername: fetchedUser?.username
        }
        try {
            const { data } = await axios.post("/api/posts/reaction", dataToSend);

            if (data.status === 200) {
                // Update the likes array in the posts
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        // Remove fetchedUser.username from the likes array
                        post.likes = post.likes.filter((person) => person !== fetchedUser.username);
                    }
                    return post;
                });

                // Update the state to trigger a re-render
                setPosts(updatedPosts);
            }
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    }
    const handleReport = (id) => {
        setPostIdToReport(id);
        setShowReportModal(true)
    }
    const handleLike = async (id, postAuthor) => {
        if (!fetchedUser) {
            return toast.error("Log in to react")
        }
        const dataToSend = {
            postID: id, action: "like", actionByUsername: fetchedUser?.username, postAuthor
        }
        try {
            const { data } = await axios.post("/api/posts/reaction", dataToSend);
            if (data.status === 200) {
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        if (post?.likes?.length > 0) {
                            post.likes = [...post.likes, fetchedUser.username]
                        }
                        else {
                            post.likes = [fetchedUser.username]
                        }
                    }
                    return post;
                });
                setPosts(updatedPosts)
            }
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    }
    const handleDelete = (id) => {
        setPostIdToDelete(id);
        setShowDeleteModal(true)
    }
    return (
        <div>
            {posts?.map((post) => (
                <div key={post._id} className='cursor-default bg-[#fffef9] shadow-xl dark:bg-[#242526] mx-2 mb-4 rounded-lg cardinhome min-h-[10vh]'>
                    <div className='p-2'>
                        <div className='relative'>
                            <BsThreeDotsVertical onClick={() => setSelectedPostIdForOptions(post?._id)} className='absolute right-0 cursor-pointer' />
                            {selectedPostIdForOptions === post?._id && (
                                <div className='z-10 absolute text-center text-sm right-0 top-2 mt-2 p-1 max-w-[200px] min-w-[150px] shadow-xl rounded-md  bg-[#f3f2f0] dark:bg-[#1c1c1c]'>
                                    <div className='flex flex-col gap-2 dark:text-white text-black '>
                                        <button className='forum-btn2 lg:hover:bg-slate-500' onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASEURL}/${post._id}`)}>Copy link</button>
                                        {fetchedUser && <button onClick={() => handleReport(post?._id)} className='forum-btn2 lg:hover:bg-slate-500'>Report</button>}
                                        {(post?.authorInfo?.username === fetchedUser?.username || fetchedUser?.isAdmin) && <button onClick={() => handleDelete(post?._id)} className='lg:hover:bg-red-500 forum-btn2'>Delete</button>}

                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer'>
                                {
                                    post?.authorInfo?.photoURL ?
                                        <Image src={post?.authorInfo?.photoURL} alt='Users Profile Photo'
                                            width={41}
                                            placeholder='empty'
                                            height={41}
                                            priority={true}
                                            quality={100}
                                            className='w-[45px] h-[45px] rounded-full border-gray-400 border-2'
                                            sizes="10vw"
                                        />
                                        : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[45px] h-[45px]'><FaUserLarge className='' /></div>
                                }
                            </div>
                            <div className='py-2'>
                                <p onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer font-semibold'>{post?.authorInfo?.name}</p>
                                <div className='text-xs flex gap-2 items-center'>
                                    <p>@{post?.authorInfo?.username}</p>
                                    <p title={formatDateInAdmin(new Date(post?.date))}> <Link className='hover:underline' href={`/${post?._id}`}>{formatRelativeDate(new Date(post?.date))}</Link></p>
                                </div>
                                {
                                    fetchedUser?.isAdmin && <div>
                                        <p className='text-[10px]'> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div >{expandedPosts?.includes(post?._id) ? <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(post?.post, theme) }}></p> : <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(truncateText(post?.post), theme) }}></p>}
                            {!expandedPosts?.includes(post?._id) && post?.post?.length > 200 && (
                                <button onClick={() => handleToggleExpand(post._id)} className='text-[10px] font-semibold'>... Show More</button>
                            )}
                            {expandedPosts?.includes(post?._id) && (
                                <button onClick={() => handleShowLess(post._id)} className='text-[10px] font-semibold pl-1'>Show Less </button>
                            )}
                        </div>
                    </div>
                    {
                        post?.videos?.length < 1 && post?.photos?.length < 1 && <div>
                            <LinkPreview text={post?.post} />
                        </div>
                    }
                    <div>
                        {
                            post?.videos && post?.videos?.length > 0 && <div>
                                <VideosInPost videosArray={post?.videos} />
                            </div>
                        }
                        {post?.photos && post?.photos?.length > 0 && <div className={`${post?.videos?.length > 0 && ""}`}>
                            <PhotosInPost
                                photosArray={post?.photos}
                                alt={post?.post}
                            />
                        </div>}
                    </div>
                    <div className='flex items-center p-2 gap-6 mt-2'>
                        <div>
                            <Link href={`/${post?._id}`} className='flex items-center flex-col'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    className='fill-black dark:fill-white'
                                >
                                    <path
                                        d="M8.92859 10C8.92859 10.2842 9.04147 10.5567 9.2424 10.7576C9.44333 10.9585 9.71585 11.0714 10 11.0714C10.2842 11.0714 10.5567 10.9585 10.7576 10.7576C10.9585 10.5567 11.0714 10.2842 11.0714 10C11.0714 9.71584 10.9585 9.44332 10.7576 9.24239C10.5567 9.04145 10.2842 8.92857 10 8.92857C9.71585 8.92857 9.44333 9.04145 9.2424 9.24239C9.04147 9.44332 8.92859 9.71584 8.92859 10ZM13.3928 10C13.3928 10.2842 13.5057 10.5567 13.7066 10.7576C13.9076 10.9585 14.1801 11.0714 14.4642 11.0714C14.7484 11.0714 15.0209 10.9585 15.2218 10.7576C15.4228 10.5567 15.5356 10.2842 15.5356 10C15.5356 9.71584 15.4228 9.44332 15.2218 9.24239C15.0209 9.04145 14.7484 8.92857 14.4642 8.92857C14.1801 8.92857 13.9076 9.04145 13.7066 9.24239C13.5057 9.44332 13.3928 9.71584 13.3928 10ZM4.46436 10C4.46436 10.2842 4.57724 10.5567 4.77817 10.7576C4.9791 10.9585 5.25162 11.0714 5.53577 11.0714C5.81993 11.0714 6.09245 10.9585 6.29338 10.7576C6.49431 10.5567 6.60719 10.2842 6.60719 10C6.60719 9.71584 6.49431 9.44332 6.29338 9.24239C6.09245 9.04145 5.81993 8.92857 5.53577 8.92857C5.25162 8.92857 4.9791 9.04145 4.77817 9.24239C4.57724 9.44332 4.46436 9.71584 4.46436 10ZM19.2231 6.125C18.7186 4.92634 17.9954 3.85045 17.0736 2.92634C16.1582 2.00758 15.0714 1.27728 13.875 0.776786C12.6473 0.261161 11.3437 0 10 0H9.95536C8.6027 0.00669643 7.29245 0.274554 6.06032 0.801339C4.87408 1.30697 3.79754 2.03857 2.89072 2.95536C1.97778 3.87723 1.26127 4.94866 0.765742 6.14286C0.252356 7.37946 -0.00656971 8.6942 0.000126634 10.0469C0.00770076 11.597 0.374434 13.1243 1.07154 14.5089V17.9018C1.07154 18.1741 1.17972 18.4353 1.37228 18.6278C1.56483 18.8204 1.826 18.9286 2.09831 18.9286H5.49336C6.87793 19.6257 8.40522 19.9924 9.95536 20H10.0022C11.3393 20 12.6361 19.7411 13.8571 19.2344C15.0475 18.7398 16.1302 18.0181 17.0446 17.1094C17.9664 16.1964 18.6919 15.1295 19.1985 13.9397C19.7253 12.7076 19.9932 11.3973 19.9999 10.0446C20.0066 8.68527 19.7432 7.36607 19.2231 6.125ZM15.8504 15.9018C14.2857 17.4509 12.2098 18.3036 10 18.3036H9.96206C8.61609 18.2969 7.27905 17.9621 6.09827 17.3326L5.91077 17.2321H2.76795V14.0893L2.6675 13.9018C2.03805 12.721 1.70323 11.3839 1.69653 10.0379C1.68761 7.8125 2.53804 5.72321 4.09829 4.14955C5.65631 2.57589 7.73887 1.70536 9.96429 1.69643H10.0022C11.1183 1.69643 12.2009 1.91295 13.2209 2.34152C14.2165 2.75893 15.1093 3.35938 15.8772 4.12723C16.6428 4.89286 17.2454 5.78795 17.6629 6.78348C18.0959 7.81473 18.3124 8.90848 18.3079 10.0379C18.2945 12.2612 17.4218 14.3438 15.8504 15.9018Z"
                                    />
                                </svg>
                                <span className='text-xs'>{post?.comment || 0} Comments</span>
                            </Link>
                        </div>
                        <div className='flex flex-col items-center'>
                            {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?

                                <svg title='You Liked this. Click to dislike' onClick={() => handleDislike(post?._id)} width={24} className="stroke-2 stroke-red-600 fill-red-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path></g></svg>

                                :
                                <svg title='Click to Like' onClick={() => handleLike(post._id, post?.authorInfo?.username)} className="stroke-2 stroke-black dark:stroke-white fill-transparent" width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path></g></svg>

                            }
                            <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.likes)}>{post?.likes?.length || 0} Likes</span>
                        </div>
                    </div>
                    {
                        showDeleteModal && <DeleteConfirmationModal id={postIdToDelete} isAuthorized={fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username} setterFunction={setShowDeleteModal} />
                    }
                    {likersArray && <LikersModal usernames={likersArray} setterFunction={setLikersArray} />}
                    {selectedUsernameToShowDetails && <ModalUser username={selectedUsernameToShowDetails} setterFunction={setSelectedUsernameToShowDetails} />}
                </div>
            ))}

            {loadingPosts && <div>
                <LoadingCards />
            </div>}
            {size > 0 && !error && !loadingPosts && noMorePosts && <div className='py-1 text-center'>
                No more posts
            </div>}
            {
                error && <div className='text-center'>
                    Error occured fetching more posts. Please reload the page.
                </div>
            }
            {/* Infinite scrolling trigger */}
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
            {
                showReportModal && <ReportModal postID={postIdToReport} key={postIdToReport} type={"post"} />
            }
        </div>
    );
};

export default HomePagePosts;
