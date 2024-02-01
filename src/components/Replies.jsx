'use client'
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import ReplyText from "./ReplyText";
import { useSearchParams } from "next/navigation";
import UserIcon from "./SVG/UserIcon";
import AuthContext from "@/contexts/AuthContext";
import dynamic from "next/dynamic";
import { LoadingModalUser } from "./LoadingSkeletons/Loaders";

const LinkPreview = dynamic(() => import('./LinkPreview'));

const Replies = ({ postID, commentID, setReplyCount, replyCount}) => {
    const pageRef = useRef(1);
    const {onlineUsers, setSelectedUsernameToShowDetails, socket } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [fetchedReplies, setFetchedReplies] = useState([]);
    const [scrolledToReply, setScrolledToReply] = useState(false);
    const searchParams = useSearchParams();
    const replyIDFromParams = searchParams.get('replyID');
    useEffect(() => {
        if (replyIDFromParams?.length > 2 && fetchedReplies?.length > 0 && !scrolledToReply) {
            const targetReply = document.getElementById(`${replyIDFromParams}`);
            if (targetReply) {
                try {
                    targetReply.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
                    targetReply.classList.add("highlightedClass");
                    setTimeout(() => {
                        targetReply.classList.remove("highlightedClass");
                        setScrolledToReply(true);
                    }, 3000);
                }
                catch {

                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [replyIDFromParams, fetchedReplies]);




    const handleLoadMore = () => {
        pageRef.current += 1;
    };

    const fetchReplies = useCallback(async () => {
        if (replyCount === 0) return;
        if (fetchedReplies?.length > 1 && fetchedReplies?.length < 10) return;

        if (fetchedReplies?.length === replyCount) return;
        try {
            setLoading(true);
            const url = `/api/getreplies?commentID=${commentID}&postID=${postID}&page=${pageRef.current}`;
            const response = await fetch(url);
            const data = await response.json();
            const newReplies = data?.replies || [];
            if (newReplies?.length === 0) {
                setHasMore(false);
            }
            setFetchedReplies((prevReplies) => [...prevReplies, ...newReplies]);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentID, postID]);

    useEffect(() => {
        (async () => {
            await fetchReplies();
        })()
    }, [fetchReplies]);

    useEffect(() => {
        if (socket) {
            socket.on('newReply', (reply) => {
                if (reply.postID === postID && reply.commentID === commentID) {
                    delete reply.commentID
                    setFetchedReplies((prevReplies) => [...prevReplies, reply]);
                    setReplyCount((prev) => prev + 1);
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('newReply');
            }
        };
    }, [postID, commentID, socket, setReplyCount]);


    return (
        <div>

            {hasMore && !loading && replyCount > fetchedReplies?.length && <div className="text-center">
                <button className="text-[10px]" onClick={handleLoadMore} disabled={loading}>
                    Load More
                </button>
            </div>}
            {
                loading && <LoadingModalUser />
            }
            {fetchedReplies.map((reply, index) => (
                <div key={index} className="mb-[10px]">
                    <div className="flex gap-2 ">
                        <div onClick={() => setSelectedUsernameToShowDetails(reply?.authorInfo?.username)} className='cursor-pointer min-w-[20px]'>
                            {
                                reply?.authorInfo?.photoURL ?
                                    <Image src={reply.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                                        width={20} height={20} loading="lazy" sizes="(max-width: 768px) 100vw, 33vw"
                                        className={`${onlineUsers?.includes(reply?.authorInfo?.username) ? "online-border-color":"offline-border-color" } rounded-full  w-[20px] h-[20px]`}
                                    />
                                    : <div className={`flex items-center justify-center rounded-full ${onlineUsers?.includes(reply?.authorInfo?.username) ? "online-border-color":"offline-border-color" } w-[20px] h-[20px]`}>
                                        <UserIcon height={"12px"} width={"12px"} />
                                    </div>
                            }
                        </div>
                        <div id={reply?._id} className='bg-gray-200 dark:bg-[#3a3b3c] px-4 py-1 rounded-xl max-w-full min-w-[200px]'>
                            <p><span className=''> <span onClick={() => setSelectedUsernameToShowDetails(reply?.authorInfo?.username)} className='text-[14px] font-semibold cursor-pointer'>{reply?.authorInfo?.name}</span> </span>
                            </p>
                            <div className='text-xs flex gap-2 items-center'>
                                <p className=''>@{reply?.authorInfo?.username}</p>
                                <p className='text-[10px]' title={reply?.date}> {formatDateInAdmin(new Date(reply?.date) || new Date())}</p>
                            </div>
                            <ReplyText
                                key={reply?._id}
                                commentID={commentID}
                                replyID={reply?._id}
                                postID={postID}
                                text={reply?.reply}
                                replyAuthor={reply?.authorInfo?.username}
                                setFetchedReplies={setFetchedReplies}
                                setReplyCount={setReplyCount}
                            />
                            <div>
                                <LinkPreview text={reply?.reply} />
                            </div>


                            {/* <p className='whitespace-pre-wrap text-[14px] py-[4px] '>{reply.reply}</p> */}
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default Replies;