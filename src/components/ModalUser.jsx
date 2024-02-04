'use client'
import AuthContext from "@/contexts/AuthContext";
import formatDateForUserJoined from "@/utils/formatDateForUserJoined";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import handleAdminAction from "@/utils/handleAdminAction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useTheme from "@/hooks/useTheme";
import makeUrlsClickable from "@/utils/makeUrlsClickable";
import HeartIcon from "./SVG/HeartIcon";
import CommentIcon from "./SVG/CommentIcon";
import UserIcon from "./SVG/UserIcon";
import dynamic from "next/dynamic";
import handleApprovePost from "@/utils/handleApprovePost";
import handleDeclinePost from "@/utils/handleDeclinePost";
import { LoadingModalData, LoadingModalUser } from "./LoadingSkeletons/Loaders";



// dynamic imports
const PhotosInPost = dynamic(() => import('./PhotosInPost'));
const VideosInPost = dynamic(() => import('./video-components/VideosInPost'));
const LinkPreview = dynamic(() => import('./LinkPreview'));


const ModalUser = () => {
    const { theme } = useTheme();
    const [user, setUser] = useState({});
    const { fetchedUser, onlineUsers, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails } = useContext(AuthContext);
    const [postsByUser, setPostsByUser] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [seeAllPostsClicked, setSeeAllPostsClicked] = useState(false);
    const [loadingPostData, setLoadingPostData] = useState(false);
    const router = useRouter();
    const handleSeeAllPost = async () => {
        setLoadingPostData(true);
        const res = await fetch(`/api/userdetails?allpostby=${selectedUsernameToShowDetails}`)
        const data = await res.json();
        setLoadingPostData(false);
        if (fetchedUser?.isAdmin) {
            setPostsByUser(data?.posts);
        }
        else {
            setPostsByUser(data?.posts?.filter((post) => post.status === "approved"))
        }
        setSeeAllPostsClicked(true);
    }


    useEffect(() => {
        if (selectedUsernameToShowDetails) {
            (async () => {
                setLoadingUser(true);
                const res = await fetch(`/api/userdetails?username=${selectedUsernameToShowDetails}`)
                const data = await res?.json();
                if (data?.status === 200) {
                    setUser(data?.user)
                    setLoadingUser(false);
                }
                else {
                    toast.error("Server Error.")
                    setSelectedUsernameToShowDetails(null);
                }
            })()
        }
    }, [selectedUsernameToShowDetails, setSelectedUsernameToShowDetails])

    useEffect(() => {
        const handleCloseModal = (event) => {
            if (event.target.classList.contains("modal-backdrop")) {
                setSelectedUsernameToShowDetails(null);
            }
        };
        document.addEventListener("click", handleCloseModal);
        return () => {
            document.removeEventListener("click", handleCloseModal);
        };
    }, [setSelectedUsernameToShowDetails]);

    return (
        <div>
            <dialog id="userModal" className=" modal modal-bottom sm:modal-middle">
                <input type="checkbox" id="userModal" className="modal-toggle" />
                <div className="modal-box scrollforchat">
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-0" onClick={() => setSelectedUsernameToShowDetails(null)}>✕</button>
                        </form>
                    </div>
                    {
                        loadingUser ? <LoadingModalData /> : <div>
                            <div className="flex items-center justify-center">
                                {user.photoURL ? <Image className="max-w-[200px] max-h-[200px]" width={200} height={200} src={user?.photoURL} alt="user photo" /> : <span>User has no profile picture.</span>}
                            </div>
                            <div className="flex justify-start items-center flex-col mt-4">
                                <p className="font-semibold"><span>{user?.name}</span></p>
                                <p className="text-xs">@{user?.username}</p>
                                <p >{onlineUsers && onlineUsers?.includes(user?.username) && <span className="online-text-color">online</span>}</p>
                                <p className="text-xs"><span>{user?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(user?.joined || new Date()))}</p>
                                <p className="text-xs">Gender: {user?.gender}</p>
                            </div>
                            {fetchedUser?.isAdmin && <p className="text-center">
                                {
                                    user?.blocked ? <button className="btn-green btn-green-active" onClick={() => handleAdminAction(user?.username, "unblock", fetchedUser?.username)}>Unblock</button> : <button className="btn-red" onClick={() => handleAdminAction(user?.username, "block", fetchedUser?.username)}>Block</button>
                                }
                            </p>}
                            <div>
                                <p className="text-sm">Posts By {user?.name}</p>
                                <p className="text-xs">Total: {user?.postCounts?.total || 0}</p>
                                {!user?.isAdmin && user?.postCounts?.total > 0 && <div className="text-xs">
                                    <p>Pending: {user?.postCounts?.pending || 0}</p>
                                    <p>Approved: {user?.postCounts?.approved || 0}</p>
                                    <p>Declined: {user?.postCounts?.declined || 0}</p>
                                </div>}
                            </div>
                            {
                                user?.postCounts?.total > 0 && !seeAllPostsClicked && <>
                                    {fetchedUser?.isAdmin ? <button onClick={handleSeeAllPost} className="btn-green btn-green-active">See all post</button>
                                        : (user?.postCounts?.approved > 0 && <button onClick={handleSeeAllPost} className="btn-green-active">See all post</button>)}
                                </>
                            }
                            {
                                loadingPostData && <LoadingModalUser />
                            }
                            {
                                !loadingPostData && postsByUser?.length > 0 && <div>
                                    {
                                        postsByUser?.map((post) => <div key={post._id} className="my-4 p-1 bg-base-300">
                                            <div className='flex gap-2 items-center'>
                                                <div>
                                                    {
                                                        user?.photoURL ?
                                                            <Image src={user?.photoURL} alt='User Profile Photo'
                                                                width={64} height={60} priority={true}
                                                                style={{
                                                                    width: "45px",
                                                                    height: "45px",
                                                                    borderRadius: '50%',
                                                                }}
                                                                className={`${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}
                                                            />
                                                            : <div className={`flex items-center justify-center rounded-full ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"} w-[45px] h-[45px]`}>
                                                                <UserIcon height={"35px"} width={"35px"} />
                                                            </div>
                                                    }
                                                </div>
                                                <div className='py-2'>
                                                    <p className='font-semibold'>{user?.name}</p>
                                                    <div className='text-xs'>
                                                        <p className=''>@{user?.username}</p>
                                                        <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
                                                        {
                                                            post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
                                                        }
                                                        {
                                                            !user?.isAdmin && !post?.approveDate && <p>Status: <span className={`${post.status === "declined" ? "text-red-400" : "text-green-500"}`}>{post.status}</span></p>
                                                        }

                                                        {
                                                            post?.status === "approved" && <span onClick={() => router.push(`/${post._id}`)} className="text-[#22c55e] font-medium cursor-pointer">See post</span>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            <div className='rounded-lg p-2'>
                                                <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(post?.post, theme) }}></p>
                                            </div>
                                            {
                                                post?.photos?.length > 0 && <div>
                                                    <PhotosInPost photosArray={post?.photos} alt={post?.post} />
                                                </div>
                                            }
                                            {
                                                post?.videos && post?.videos?.length > 0 && <div>
                                                    <VideosInPost videosArray={post?.videos} />
                                                </div>
                                            }
                                            {
                                                post?.videos?.length === 0 && post?.photos?.length === 0 && <div>
                                                    <LinkPreview text={post?.post} />
                                                </div>
                                            }
                                            {
                                                fetchedUser?.isAdmin && <div className="text-xs my-2">
                                                    {
                                                        post?.status === "pending" && <div> <button onClick={() => handleApprovePost({ actionBy: fetchedUser?.username, postAuthorUsername: selectedUsernameToShowDetails, postID: post?._id, action: "approve" }, setPostsByUser)} className="btn-green-sm">Approve</button>  <button onClick={() => handleDeclinePost({ actionBy: fetchedUser.username, postAuthorUsername: selectedUsernameToShowDetails, postID: post?._id, action: "decline" }, setPostsByUser)} className="bg-red-700 rounded-md px-[4px] py-[2px] text-white cursor-pointer">Decline</button> </div>
                                                    }
                                                </div>
                                            }

                                            {
                                                post?.status === "approved" && <div className='flex items-center gap-6 mt-2'>
                                                    <div className='flex items-center flex-col'>
                                                        <CommentIcon fill={post?.comment > 0 ? "#7637e7" : "#000000"} />
                                                        <span className='text-xs'>{(post?.comment) || 0} Comments</span>
                                                    </div>
                                                    <div className='flex flex-col items-center'>
                                                        {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?
                                                            <HeartIcon classes={"stroke-2 stroke-red-600 fill-red-600"} title={'You Liked this.'} />
                                                            :
                                                            <HeartIcon title={'You did not like this'} classes={"stroke-2 stroke-black dark:stroke-white fill-transparent"} />}
                                                        <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>)
                                    }
                                </div>
                            }
                        </div>
                    }

                </div>
                <label className="modal-backdrop cursor-default" htmlFor="userModal"></label>
            </dialog>

        </div>
    );
};

export default ModalUser;