'use client'
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserIcon from "./SVG/UserIcon";
import CommentIcon from "./SVG/CommentIcon";
import HeartIcon from "./SVG/HeartIcon";

const PostShowingFormat = ({ post, fetchedUser }) => {
    const router = useRouter();
    return (
        <div className="my-4 p-1 bg-base-300 cardinhome">
            <div className='flex gap-2 items-center'>
                <div>
                    {
                        fetchedUser?.photoURL ?
                            <Image src={fetchedUser?.photoURL} blurDataURL='' alt='User Profile Photo'
                                width={64} height={60} priority={true}
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: '50%',
                                }}
                                className={`${onlineUsers?.includes(fetchedUser?.username) ? "online-border-color" : "offline-border-color"}`}
                            />
                            : <div className={`flex items-center justify-center rounded-full  w-[45px] h-[45px] ${onlineUsers?.includes(fetchedUser?.username) ? "online-border-color" : "offline-border-color"}`}>
                                <UserIcon height={"35px"} width={"35px"} />
                            </div>
                    }
                </div>
                <div className='py-2'>
                    <p className='font-semibold'>{fetchedUser?.name}</p>
                    <div className='text-xs'>
                        <p className=''>@{fetchedUser?.username}</p>
                        <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
                        {
                            post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
                        }
                        {
                            !fetchedUser?.isAdmin && !post?.approveDate && <p>Status: <span className={`${post.status === "declined" ? "text-red-400" : "text-green-500"}`}>{post.status}</span></p>
                        }

                        {
                            post?.status === "approved" && <span onClick={() => router.push(`/${post._id}`)} className="text-[#308853] cursor-pointer">See post</span>
                        }

                    </div>
                </div>
            </div>
            <div className='whitespace-pre-wrap rounded-lg p-2'>
                {post?.post}
            </div>
            {
                post?.status === "approved" && <div className='flex items-center gap-6 mt-2'>
                    <div className='flex items-center flex-col'>
                        <CommentIcon fill={post?.comment?.length > 0 ? "#7637e7" : "#000000"} />
                        <span className='text-xs'>{(post?.comment?.length) || 0} Comments</span>
                    </div>
                    <div className='flex flex-col items-center'>
                        {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?
                            <HeartIcon classes={"stroke-2 stroke-red-600 fill-red-600"} title={'You Liked this.'} />
                            :
                            <HeartIcon title={'You did not liked this.'} classes={"stroke-2 stroke-black dark:stroke-white fill-transparent"} />
                        }
                        <span className='text-xs'>{post?.likes?.length || 0} Likes</span>
                    </div>
                </div>
            }
        </div>)
}

export default PostShowingFormat;