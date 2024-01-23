'use client'
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaUserLarge } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { RiSendPlane2Fill } from "react-icons/ri";
import TextareaAutosize from 'react-textarea-autosize';
import axios from "axios";
import Replies from "./Replies";
import { BsDot } from "react-icons/bs";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CommentEditModal from "./CommentEditModal";
import ReportModal from "./ReportModal";
import makeUrlsClickable from "@/utils/makeUrlsClickable";
import useTheme from "@/hooks/useTheme";
import LinkPreview from "./LinkPreview";
const Comments = ({ c, postAuthor, handleShowUser, likes, socket, commentId: commentID, replies, setLikersArray, handleDislike, hanldleLike, postID, setPost }) => {
  const [replyText, setReplyText] = useState("");
  const [replyCount, setReplyCount] = useState(replies);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const { fetchedUser, showDeleteModal, setShowDeleteModal, showReportModal, setShowReportModal, reportingCommentId, setReportingCommentId, reportingReplyId } = useContext(AuthContext);
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [loadingNewReply, setLoadingNewReply] = useState(false);
  const { theme } = useTheme();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewReply(e);
    }
  }
  const handleNewReply = async (e) => {
    e.preventDefault()
    if (!replyText) {
      return toast.error("Oho! Type something to reply.")
    }
    if (!fetchedUser) {
      return toast.error("Oho! Login to reply.")
    }
    const dataToSend = {
      reply: replyText,
      author: fetchedUser?.username,
      commentID,
      postID,
      date: new Date(),
    }
    try {
      setLoadingNewReply(true);
      const { data } = await axios.post("/api/newreply", dataToSend);
      if (data.status === 200) {
        // send data with socket
        const dataToSendInSocket = {
          reply: replyText,
          date: dataToSend.date,
          _id: data?._id,
          likes: [],
          authorInfo: {
            username: fetchedUser?.username,
            photoURL: fetchedUser?.photoURL,
            name: fetchedUser?.name
          },
          postID,
          commentID
        }
        const newCommentNotification = {
          author: {
            username: fetchedUser?.username,
            name: fetchedUser?.name,
            photoURL: fetchedUser?.photoURL,

          },
          commentAuthor: [{ username: fetchedUser.username }],
          postAuthor: [{ username: postAuthor }],
          date: dataToSend?.date,
          postID,
          commentID,
          type: "reply"
        }
        if (socket) {
          socket.emit("newReply", dataToSendInSocket);
          socket.emit("newCommentNotification", { newCommentNotification, commentID });
        }
      }
      else {
        toast.error(data?.message)
      }
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setReplyText("");
      setLoadingNewReply(false);
    }
  }

  useEffect(() => {
    if (showCommentEditModal) {
      document?.getElementById('commentEditModal')?.showModal()
    }
    if (!showCommentEditModal) {
      document?.getElementById('commentEditModal')?.close()
    }
  }, [showCommentEditModal])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showCommentOptions &&
        !event?.target?.closet?.(`div`)?.querySelector(`.${commentID}`)
      ) {
        setShowCommentOptions(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showCommentOptions, commentID]);




  const handleReport = (id) => {
    setReportingCommentId(id);
    setShowReportModal(true);
  }
  return (
    <div className='duration-1000 my-1 pl-4 pr-2'>
      {
        c?.author?.authorInfo?.name && <>
          <div className='flex gap-2'>
            <div onClick={() => handleShowUser(c?.author?.username)} className='cursor-pointer min-w-[35px] h-[35px] rounded-full'>
              {
                c?.author?.authorInfo?.photoURL ?
                  <Image src={c?.author?.authorInfo?.photoURL} blurDataURL='' alt='User Profile Photo'
                    width={35} height={35} loading="lazy" layout="fixed"

                    className='border-gray-400 border-2 w-[35px] h-[35px] rounded-full'
                  />
                  : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[35px] h-[35px]'><FaUserLarge className='' /></div>
              }
            </div>
            <div id={commentID} className='bg-gray-200 dark:bg-[#3a3b3c] px-4 py-1 rounded-xl max-w-full min-w-[200px]'>
              <p><span className=''> <span onClick={() => handleShowUser(c?.author?.username)} className='text-[14px] font-semibold cursor-pointer'>{c?.author?.authorInfo?.name}</span> </span> <span className='text-[10px]'>{(c?.author?.username === postAuthor && "Author")}</span>
                <span className='text-[9px]'> {(c?.author?.authorInfo?.isAdmin && "Admin")} </span>
              </p>
              <div className='text-[9px] flex gap-2 items-center'>
                <p >@{c?.author?.username}</p>
                <p title={c?.date}> {formatDateInAdmin(new Date(c?.date) || new Date())}</p>
              </div>
              {fetchedUser && <div onClick={() => setShowCommentOptions(!showCommentOptions)} className="relative cursor-pointer">
                <div className="absolute top-0 -right-4">
                  <BsDot />
                </div>
              </div>}
              <div className={`relative ${commentID}`}>
                {
                  showCommentOptions && fetchedUser && <div className="absolute text-sm right-0 z-10 top-2 mt-2 p-1 max-w-[200px] shadow-xl rounded-md bg-white dark:bg-[#1c1c1c]" >
                    {fetchedUser && fetchedUser?.username === c?.author?.username && <button onClick={() => setShowCommentEditModal(true)} className=" forum-btn2 lg:hover:bg-slate-500 w-full">Edit</button>}
                    <button onClick={() => handleReport(commentID)} className="forum-btn2 lg:hover:bg-slate-500 w-full my-1">Report</button>
                    {fetchedUser && (fetchedUser?.isAdmin || fetchedUser?.username === c?.author?.username) && <button onClick={() => setShowDeleteModal(true)} className="lg:hover:bg-red-700 forum-btn2 w-full lg:hover:text-white">Delete</button>}
                  </div>
                }
              </div>
              <p className='rounded scroll-reveal py-[4px] text-[14px]' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(c.comment, theme) }}></p>

              <div>
                <LinkPreview text={c?.comment} />
              </div>

            </div>
          </div>

          {/* comment reply and like section */}
          <div className="flex items-center gap-6 pt-[1px] text-xs pb-1 pl-[43px] text-[14px]">
            <div onClick={() => setShowReplyInput(!showReplyInput)} className='flex items-center cursor-pointer flex-col' >
              <FaReply className="rotate-180" />
              <span className='text-[10px]'>{replyCount || 0} Replies</span>
            </div>
            <div className='flex flex-col items-center'>
              {likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ? <FaHeart title='You Liked this. Click to dislike' onClick={() => handleDislike(c._id)} className=' text-red-600 cursor-pointer' /> : <FaRegHeart title='Click to Like' onClick={() => hanldleLike(c?._id)} className='cursor-pointer' />}
              <span className='text-[10px] cursor-pointer' onClick={() => setLikersArray(likes)}>{likes?.length || 0} Likes</span>
            </div>
          </div>
          {/* show replies */}
          <div className="pl-[43px]">
            {
              showReplyInput && <Replies
                postID={postID}
                replyCount={replyCount}
                setReplyCount={setReplyCount}
                commentID={commentID}
                handleShowUser={handleShowUser}
                socket={socket}
              />
            }
          </div>
          {
            showReplyInput && fetchedUser && <form onSubmit={(e) => handleNewReply(e)} className={`ml-[43px] mt-2 relative w-[90%] ${loadingNewReply ? "opacity-40" : "opacity-100"}`}>
              <TextareaAutosize
                maxRows={3}
                disabled={loadingNewReply}
                onKeyDown={handleKeyDown}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply as ${fetchedUser.name}`}
                className='py-[6px] resize-none pl-2 bg-slate-200 dark:bg-[#3b3b3b] rounded-xl placeholder:text-[10px] text-sm pr-[44px] focus:outline-none bordered w-full'
              />
              <div className="absolute bottom-[25%]  right-2">
                <button
                  title="click to comment"
                  disabled={loadingNewReply}

                  className={`forum-btn1`}
                  type="submit"
                >
                  < RiSendPlane2Fill className={` ${replyText === ""
                    ? "text-slate-500 cursor-default"
                    : "text-[#1ab744] active:text-[#0a4421] text:hover:text-[#0a4421]"
                    }`} />
                </button>
              </div>
            </form>
          }
        </>
      }
      {
        showReportModal && reportingCommentId && !reportingReplyId && <ReportModal postID={postID} key={reportingCommentId} commentID={reportingCommentId} type={"comment"} />
      }
      {
        showDeleteModal && <DeleteConfirmationModal setterFunction={setShowDeleteModal} id={postID} setPost={setPost} commentID={commentID} />
      }
      {
        showCommentEditModal && <CommentEditModal comment={c?.comment} setterFunction={setShowCommentEditModal} setPost={setPost} postID={postID} commentID={commentID} />
      }
    </div>
  );
};

export default Comments;