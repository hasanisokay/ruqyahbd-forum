'use client'
import dynamic from 'next/dynamic';
import formatRelativeDate from '@/utils/formatDate';
import { useRef, useContext, useState, useEffect } from 'react';
import AuthContext from '@/contexts/AuthContext';
import truncateText from '@/utils/trancatText';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import Link from 'next/link';
import makeUrlsClickable from '@/utils/makeUrlsClickable';
import useTheme from '@/hooks/useTheme';
import getPosts from '@/utils/getPosts';

import "@/../css/spinner.css";
import Image from 'next/image';
import toast from 'react-hot-toast';
import copyToClipboard from '@/utils/copyToClipboard';
import ReportModal from '../ReportModal';
import ModalUser from '../ModalUser';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import LikersModal from '../LikersModal';
import UserIcon from '../SVG/UserIcon';
import ThreeDotsIcon from '../SVG/ThreeDotsIcon';
import HeartIcon from '../SVG/HeartIcon';
import CommentIcon from '../SVG/CommentIcon';
import handleShowLess from '@/utils/handleShowLess';
import handleToggleExpand from '@/utils/handleToggleExpand';
import { LoadingCards } from '../LoadingSkeletons/Loaders';
// dynamic imports
// const LoadingCards = dynamic(() => import('../LoadingSkeletons/LoadingCards'));
const PhotosInPost = dynamic(() => import('../PhotosInPost'));
const VideosInPost = dynamic(() => import('../video-components/VideosInPost'));
const LinkPreview = dynamic(() => import('../LinkPreview'));

const HomePagePosts = ({ tenPostsArray }) => {
    const { fetchedUser, showDeleteModal, setShowDeleteModal, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails, showReportModal, setShowReportModal, onlineUsers } = useContext(AuthContext);
    const infiniteScrollRef = useRef();
    const { theme } = useTheme();
    const [selectedPostIdForOptions, setSelectedPostIdForOptions] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [likersArray, setLikersArray] = useState(null);
    const [postIdToReport, setPostIdToReport] = useState(null);
    const [postIdToDelete, setPostIdToDelete] = useState(null)
    const [size, setSize] = useState(1)
    const [posts, setPosts] = useState(tenPostsArray);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [error, setError] = useState(null);


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
        const fetchPosts = async () => {
            setLoadingPosts(true);
            const data = await getPosts(size);
            setLoadingPosts(false)
            if (data?.message) {
                return setError(data?.message);
            }
            else {
                setError("");
                setPosts((prev) => [...prev, ...data])
            }
        }
        if (size < 2) return;
        else {
            fetchPosts()
        }
    }, [size])

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
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            };

            const response = await fetch('/api/posts/reaction', requestOptions);
            const data = await response.json();

            if (data.status === 200) {
                // Update the likes array in the posts
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        // Remove fetchedUser.username from the likes array
                        post.likes = post.likes.filter((person) => person !== fetchedUser?.username);
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
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            };

            const response = await fetch('/api/posts/reaction', requestOptions);
            const data = await response.json();

            if (data.status === 200) {
                const updatedPosts = posts.map((post) => {
                    if (post._id === id) {
                        if (post?.likes?.length > 0) {
                            post.likes = [...post.likes, fetchedUser?.username]
                        }
                        else {
                            post.likes = [fetchedUser?.username]
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
        <>
            {posts?.map((post) => (
                <div key={post._id} className='cursor-default bg-[#fffef9] shadow-xl dark:bg-[#242526] mx-2 mt-4 mb-4 rounded-lg cardinhome min-h-[10vh]'>
                    <div className='p-2'>
                        <div className='relative'>
                            <ThreeDotsIcon
                                height={"20px"}
                                width={"20px"}
                                handleOnclick={() => setSelectedPostIdForOptions(post?._id)}
                                classes={"absolute right-0 cursor-pointer"}
                            />
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
                                        <Image src={post?.authorInfo?.photoURL} alt='User Profile Photo'
                                            width={41}
                                            placeholder='empty'
                                            height={41}
                                            priority={true}
                                            quality={100}
                                            className={`w-[45px] h-[45px] rounded-full ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        : <div className={`flex items-center justify-center rounded-full ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"} w-[45px] h-[45px]`}>
                                            <UserIcon height={"35px"} width={"35px"} />
                                        </div>
                                }
                            </div>
                            <div className='py-2'>
                                <p onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer font-semibold'>{post?.authorInfo?.name}</p>
                                <div className='text-xs flex gap-2 items-center'>
                                    <p>@{post?.authorInfo?.username}</p>
                                    <p title={formatDateInAdmin(new Date(post?.date))}> <Link className='hover:underline min-w-[48px] min-h-[48px]' href={`/${post?._id}`}>{formatRelativeDate(new Date(post?.date))}</Link></p>
                                </div>
                                {
                                    fetchedUser?.isAdmin && <div>
                                        <p className='text-[10px]'> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined))}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div>{expandedPosts?.includes(post?._id) ? <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(post?.post, theme) }}></p> : <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(truncateText(post?.post), theme) }}></p>}
                            {!expandedPosts?.includes(post?._id) && post?.post?.length > 200 && (
                                <button onClick={() => handleToggleExpand(setExpandedPosts, post?._id)} className='text-[10px] font-semibold'>... Show More</button>
                            )}
                            {expandedPosts?.includes(post?._id) && (
                                <button onClick={() => handleShowLess(setExpandedPosts, post?._id)} className='text-[10px] font-semibold pl-1'>Show Less </button>
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
                            post?.videos && post?.videos?.length > 0 && <>
                                <VideosInPost videosArray={post?.videos} />
                            </>
                        }
                        {post?.photos && post?.photos?.length > 0 && <div className={`${post?.videos?.length > 0 && ""}`}>
                            <PhotosInPost
                                photosArray={post?.photos}
                                alt={post?.post}
                            />
                        </div>}
                    </div>
                    <div className='flex items-center p-2 gap-6 mt-2'>
                        <>
                            <Link href={`/${post?._id}`} className='flex items-center flex-col'>
                                <CommentIcon fill={post?.comment > 0 ? "#7637e7" : theme === "dark" ? "#ffffff" : "#000000"} />
                                <span className='text-xs'>{post?.comment || 0} Comments</span>
                            </Link>
                        </>
                        <div className='flex flex-col items-center'>
                            {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?
                                <HeartIcon classes={"stroke-2 stroke-red-600 fill-red-600"} title={'You Liked this. Click to dislike'} handleOnclick={() => handleDislike(post?._id)} />
                                :
                                <HeartIcon handleOnclick={() => handleLike(post._id, post?.authorInfo?.username)} title={'Click to Like'} classes={"stroke-2 stroke-black dark:stroke-white fill-transparent"} />
                            }
                            <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.likes)}>{post?.likes?.length || 0} Likes</span>
                        </div>
                    </div>
                    {
                        showDeleteModal && <DeleteConfirmationModal id={postIdToDelete} isAuthorized={fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username} setterFunction={setShowDeleteModal} />
                    }
                    {likersArray && <LikersModal usernames={likersArray} setterFunction={setLikersArray} />}
                    {selectedUsernameToShowDetails && <ModalUser />}
                </div>
            ))}

            {loadingPosts && <LoadingCards />}
            {size > 0 && !error && !loadingPosts && noMorePosts && <p className='py-1 text-center'>
                No more posts
            </p>}
            {
                error && error?.length > 0 && <p className='text-center'>{error} Please reload the page.</p>
            }
            {/* Infinite scrolling trigger */}
            {
                showReportModal && <ReportModal postID={postIdToReport} key={postIdToReport} type={"post"} />
            }
            <div ref={infiniteScrollRef} style={{ height: '10px' }} />
        </>
    );
};

export default HomePagePosts;

