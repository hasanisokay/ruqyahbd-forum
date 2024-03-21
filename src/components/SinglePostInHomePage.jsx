'use client'
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import formatDateForUserJoined from '@/utils/formatDateForUserJoined';
import formatDateInAdmin from '@/utils/formatDateInAdmin';
import useTheme from '@/hooks/useTheme';
import makeUrlsClickable from '@/utils/makeUrlsClickable';
import copyToClipboard from '@/utils/copyToClipboard';
import Image from 'next/image';
import ModalUser from '@/components/ModalUser';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import PostEditModal from '@/components/PostEditModal';
import ReportModal from '@/components/ReportModal';
import LikersModal from '@/components/LikersModal';
import UserIcon from '@/components/SVG/UserIcon';
import HeartIcon from '@/components/SVG/HeartIcon';
import CommentIcon from '@/components/SVG/CommentIcon';
import ThreeDotsIcon from '@/components/SVG/ThreeDotsIcon';
import SendMessageIcon from '@/components/SVG/SendMessageIcon';
import DislikeIcon from './SVG/DislikeIcon';
import handleUnHate from '@/utils/handleUnHate';
import handleHate from '@/utils/handleHate';

// dynamic imports
const TextareaAutosize = dynamic(() => import('react-textarea-autosize'), { ssr: false });
const Comments = dynamic(() => import('@/components/Comments'), { ssr: false });
const PhotosInPost = dynamic(() => import('@/components/PhotosInPost'), { ssr: false });
const VideosInPost = dynamic(() => import('@/components/video-components/VideosInPost'), { ssr: false });
const LinkPreview = dynamic(() => import('@/components/LinkPreview'), { ssr: false });


const SinglePostInHomePage = ({ fetchedPost }) => {
  const id = fetchedPost?._id;
  const [likersArray, setLikersArray] = useState(null);
  const { socket, fetchedUser, onlineUsers, showDeleteModal, setShowDeleteModal, showReportModal, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails, setShowReportModal, isReportingPost, setIsReportingPost } = useContext(AuthContext);
  const [newCommentData, setNewCommentData] = useState("");
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [post, setPost] = useState(fetchedPost);
  const [selectedPostIdForOptions, setSelectedPostIdForOptions] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [scrolledToComment, setScrolledToComment] = useState(false);
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const commentID = searchParams.get('commentID');

  useEffect(() => {
    if (commentID?.length > 2 && !scrolledToComment && post) {
      const targetComment = document.getElementById(`${commentID}`);
      if (targetComment) {
        try {
          targetComment.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
          targetComment.classList.add("highlightedClass");
          setTimeout(() => {
            targetComment.classList.remove("highlightedClass");
            setScrolledToComment(true);
          }, 3000);
        }
        catch {

        }
      }
    }
  }, [commentID, scrolledToComment, post]);

  useEffect(() => {
    if (likersArray) {
      document?.getElementById('likerModal')?.click();
    }
  }, [likersArray]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', { roomId: id });
    }
  }, [id, socket])

  useEffect(() => {
    if (socket) {
      socket.on('newComment', (comment) => {
        if (comment.postID === id) {
          setPost((prevPost) => ({
            ...prevPost,
            comment: [comment, ...prevPost.comment,
            ],
          }));
        }
      });
    }
    return () => {
      if (socket) {
        socket.emit('leaveRoom', { roomId: id });
        socket.off("newComment")
      }
    };
  }, [id, socket]);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectedPostIdForOptions &&
        !event.target.closest('.relative')
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

  useEffect(() => {
    if (showEditModal) document?.getElementById('editModal')?.showModal()
  }, [showEditModal])

  const handleShowUser = (username) => {
    setSelectedUsernameToShowDetails(username);
  }
  const handleNewCommentForm = async (e) => {
    e.preventDefault()
    if (newCommentData === "") {
      return;
    }
    if (!fetchedUser) {
      return toast.error("Log in to comment.")
    }

    const dataToSend = {
      comment: newCommentData,
      postID: id,
      date: new Date(),
      author: { username: fetchedUser?.username },
    };
    try {
      setLoadingNewComment(true);
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      };

      const response = await fetch('/api/posts/comment', requestOptions);
      const data = await response.json();
      if (data?.status === 200) {
        // send comment with socket
        const dataToSendInSocket = {
          comment: newCommentData,
          date: dataToSend.date,
          _id: data?._id,
          likes: [],
          dislikes: [],
          replies: 0,
          author: {
            username: fetchedUser.username,
            authorInfo: {
              isAdmin: fetchedUser.isAdmin,
              name: fetchedUser.name,
              photoURL: fetchedUser.photoURL
            }
          },
          postID: id,
        }


        const newCommentNotification = {
          _id: data?._id,
          author: {
            username: fetchedUser?.username,
            name: fetchedUser?.name,
            photoURL: fetchedUser?.photoURL,

          },
          commentAuthor: [{ username: fetchedUser.username }],
          postAuthor: [{ username: post?.authorInfo?.username }],
          date: dataToSend?.date,
          postID: id,
          commentID: data?._id,
          type: "comment",
          read: false
        }

        if (socket) {
          socket.emit('newComment', dataToSendInSocket);
          socket.emit("newCommentNotification", { newCommentNotification });
        }
      }
      if (data?.status === 500) {
        toast.error(data?.message || "error")
      }
    } catch (error) {
      console.error("Error commenting:", error);
    }
    finally {
      setNewCommentData("");
      setLoadingNewComment(false)
    }
  };

  const handleDislike = async (commentID = undefined) => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "dislike", actionByUsername: fetchedUser?.username
    }
    try {
      if (commentID) {
        dataToSend.commentID = commentID;
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      };

      const response = await fetch('/api/posts/reaction', requestOptions);
      const data = await response.json();
      if (data?.status === 200 && commentID) {
        setPost((prevPost) => ({
          ...prevPost,
          comment: prevPost.comment.map((c) =>
            c._id === commentID
              ? {
                ...c,
                likes: c.likes.filter((uname) => uname !== fetchedUser.username),
              }
              : c
          ),
        }))
      }
      if (data?.status === 200 && !commentID) {
        const filteredLikesArray = post?.likes?.filter((uname) => uname !== fetchedUser.username)
        setPost(prevPost => ({ ...prevPost, likes: filteredLikesArray }));
      }

    } catch (error) {
      console.error("Error disliking post:", error);
    }
  }
  const hanldleLike = async (commentID = undefined) => {
    if (!fetchedUser) {
      return toast.error("Log in to react")
    }
    const dataToSend = {
      postID: id, action: "like", actionByUsername: fetchedUser?.username
    }
    try {
      if (commentID) {
        dataToSend.commentID = commentID;
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      };

      const response = await fetch('/api/posts/reaction', requestOptions);
      const data = await response.json();

      if (data?.status === 200 && commentID) {
        setPost((prevPost) => ({
          ...prevPost,
          comment: prevPost.comment.map((c) =>
            c._id === commentID
              ? {
                ...c,
                likes: [...c.likes, fetchedUser.username]
              }
              : c
          ),
        }))
      }
      if (data?.status === 200 && !commentID) {
        if (post._id === id) {
          if (post?.likes?.length > 0) {
            setPost(prevPost => ({ ...prevPost, likes: [...prevPost?.likes, fetchedUser?.username] }));
          } else {
            setPost(prevPost => ({ ...prevPost, likes: [fetchedUser?.username] }));
          }
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
  const handleEdit = () => {
    if (fetchedUser.username !== post?.authorInfo?.username) return toast.error("unauthorized action")
    setShowEditModal(true);
  }
  const handleClickReport = async () => {
    setShowReportModal(true);
    setIsReportingPost(true);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNewCommentForm(e);
    }
  }

  return (
    <div className='p-2 cursor-default bg-[#fffef9] dark:bg-[#242526] m-2 rounded-lg dark:border-gray-400 cardinhome shadow-xl'>
      <div className='relative'>
        <ThreeDotsIcon
          handleOnclick={() => setSelectedPostIdForOptions(id)}
          height={"20px"}
          width={"20px"}
          classes={'absolute right-0 cursor-pointer'}
        />
        {selectedPostIdForOptions === id && (
          <div className='absolute text-sm right-0 top-2 mt-2 p-1 max-w-[200px] z-10 shadow-xl rounded-md bg-[#f3f2f0] dark:bg-[#1c1c1c]'>
            <div className='flex flex-col justify-start items-start gap-2 dark:text-white text-black  '>
              {(fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username) && <button onClick={() => setShowDeleteModal(true)} className='lg:hover:bg-red-700 forum-btn2'>Delete Post</button>}
              {fetchedUser?.username === post?.authorInfo?.username && <button onClick={handleEdit} className='forum-btn2 lg:hover:bg-slate-500 w-full'>Edit Post</button>}
              <button className='forum-btn2 lg:hover:bg-slate-500 w-full' onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASEURL}/${id}`)}>Copy link</button>
              {fetchedUser && <button onClick={handleClickReport} className='forum-btn2 lg:hover:bg-slate-500 w-full'>Report</button>}
            </div>
          </div>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        <div onClick={() => handleShowUser(post?.authorInfo?.username)} className='cursor-pointer'>
          {
            post?.authorInfo?.photoURL ?
              <Image
                src={post?.authorInfo?.photoURL}
                blurDataURL=''
                alt='User Profile Photo'
                width={64} height={0}
                priority={true}
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: '50%',
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}
              />
              : <div className={`flex items-center justify-center rounded-full w-[45px] h-[45px] ${onlineUsers?.includes(post?.authorInfo?.username) ? "online-border-color" : "offline-border-color"}`}>
                <UserIcon height={"35px"} width={"35px"} /></div>
          }
        </div>
        <div className='py-2'>
          <p onClick={() => handleShowUser(post?.authorInfo?.username)} className='font-semibold cursor-pointer'>{post?.authorInfo?.name}</p>
          <div className='text-xs'>
            <p className=''>@{post?.authorInfo?.username}</p>
            {post?.authorInfo?.joined && <p> <span>{post?.authorInfo?.isAdmin ? "Admin" : "Member"} since</span> {formatDateForUserJoined(new Date(post?.authorInfo?.joined || new Date()))}</p>}
          </div>
        </div>
      </div>
      {/* <div className='whitespace-pre-wrap'>
        {post.post}
      </div> */}

      <div>
        <p className='scroll-reveal' dangerouslySetInnerHTML={{ __html: makeUrlsClickable(post?.post, theme) }}></p>
      </div>

      <div>
        {
          post?.videos && post?.videos?.length > 0 && <div>
            <VideosInPost videosArray={post?.videos} />
          </div>
        }
        {
          post?.photos && post?.photos?.length > 0 && <PhotosInPost
            photosArray={post?.photos}
            key={id}
          />
        }
        {
          post?.videos?.length === 0 && post?.photos?.length === 0 && <div>
            <LinkPreview text={post?.post} />
          </div>
        }
      </div>
      <div className='text-[10px] pt-2'>
        {
          post?.date && <p className='' title={post.date}> Posted: {formatDateInAdmin(new Date(post.date))}</p>
        }
        {
          post?.approveDate && <p className='' title={post.date}> Approved: {formatDateInAdmin(new Date(post.approveDate))}</p>
        }
      </div>
      {/*like section */}
      <div className='reaction-box mt-2'>
        <div className='reaction-item'>
          <CommentIcon fill={(post?.comment?.length > 0 && post?.comment[0].author?.authorInfo?.name) ? "#7637e7" : theme === "dark" ? "#ffffff" : "#000000"} />
          <span className='text-xs'>{(post?.comment && post?.comment[0]?.author?.authorInfo?.name && post?.comment?.length) || 0} {post?.comment?.length > 1 ? "Comments" : "Comment" }</span>
        </div>
        <div className='reaction-item'>
          {post?.likes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?
            <HeartIcon title={"You Liked this. Click to dislike"} handleOnclick={() => handleDislike()} classes={'stroke-2 stroke-red-600 fill-red-600'} /> :
            <HeartIcon title={"Click to Like"} handleOnclick={() => hanldleLike()} classes={"stroke-2 stroke-black dark:stroke-white fill-transparent"} />}
          <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.likes)}>{post?.likes?.length || 0} {post?.likes?.length > 1 ? "Likes" : "Like" }</span>
        </div>
        <div className=' reaction-item'>
          {post?.dislikes?.filter((username) => username === fetchedUser?.username)?.length > 0 ?
            <DislikeIcon classes={"stroke-2 stroke-blue-600 fill-blue-600"} title={'You Disliked this. Click to remove'} handleOnclick={() => handleHate(post?._id)} />
            :
            <DislikeIcon handleOnclick={() => handleUnHate(post._id, post?.authorInfo?.username)} title={'Click to dislike'} classes={"stroke-2 stroke-black dark:stroke-white dark:fill-white fill-black"} />
          }
          <span className='text-xs cursor-pointer' onClick={() => setLikersArray(post?.dislikes)}>{post?.dislikes?.length || 0} {post?.dislikes?.length > 1 ? "Dislikes" : "Dislike"}</span>
        </div>
      </div>
      {
        fetchedUser && !fetchedUser?.blocked && <div>
          <form
            onSubmit={(e) => handleNewCommentForm(e)}
            className={`relative ${loadingNewComment ? "opacity-40" : "opacity-100"} mt-4`}
          >
            <TextareaAutosize
              value={newCommentData}
              disabled={loadingNewComment}
              maxRows={3}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewCommentData(e.target.value)}
              placeholder={`Comment as ${fetchedUser.name}`}
              className="pl-2 resize-none py-[10px] scrollforchat bg-slate-200 dark:bg-[#3b3b3b] pr-[34px] rounded-xl placeholder:text-[12px] text-sm focus:outline-none w-full"

            />
            <div className="absolute bottom-[20%]  right-2">
              <button
                title="click to comment"
                disabled={loadingNewComment}
                className={`${newCommentData === "" && "cursor-default"}`}
                type="submit"
              >
                <SendMessageIcon
                  fill={newCommentData === "" ? "#494a54" : (theme === "dark" ? "#ffffff" : "#22c55e")}
                  width={"22px"}
                  height={"22px"}
                />
              </button>
            </div>
          </form>
        </div>
      }
      {
        post?.comment?.length > 0 && <div>
          {post?.comment?.map((c, index) => (
            <Comments
              key={index}
              c={c}
              setPost={setPost}
              socket={socket}
              postID={id}
              commentId={c?._id}
              replies={c?.replies}
              likes={c?.likes}
              postAuthor={post?.authorInfo?.username}
              setLikersArray={setLikersArray}
              handleDislike={handleDislike}
              hanldleLike={hanldleLike}
            />
          ))}
        </div>
      }
      {
        showReportModal && isReportingPost && <ReportModal postID={id} key={id} type={"post"} />
      }
      {
        showEditModal && fetchedUser?.username === post?.authorInfo?.username && <PostEditModal setPost={setPost} setterFunction={setShowEditModal} post={post} />
      }
      {
        showDeleteModal && <DeleteConfirmationModal id={id} isAuthorized={fetchedUser?.isAdmin || fetchedUser?.username === post?.authorInfo?.username} setterFunction={setShowDeleteModal} />
      }
      {likersArray && <LikersModal usernames={likersArray} setterFunction={setLikersArray} />}
      {selectedUsernameToShowDetails && <ModalUser />}
      <div />
    </div >
  );
};
export default SinglePostInHomePage;