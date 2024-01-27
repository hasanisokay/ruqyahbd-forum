'use client'
import Link from "next/link";
import NavLink from "./NavLink";
import { afterLoginNavData, beforeLoginNavData, commonNavData } from "@/data/navData";
import useTheme from "@/hooks/useTheme";
import { useContext, useEffect, useRef, useState, useTransition } from "react";
import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import logoForDarkMode from "@/../public/images/bd-support-1.png"
import { io } from "socket.io-client";
import formatDateInAdmin from "@/utils/formatDateInAdmin";
import formatRelativeDate from "@/utils/formatDate";
import notificationMaker from "@/utils/notificationMaker";
import LoadingNotifications from "../LoadingNotificaions";
import Image from "next/image";
import BellIcon from "../SVG/BellIcon";
import UserIcon from "../SVG/UserIcon";

const Navbar = () => {
  const [navToggle, setNavToggle] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { fetchedUser, loading, logOut, loggedOut, notificationsCount, allNotifications, setAllNotifications, setNotificationsCount } = useContext(AuthContext);
  const [navData, setNavData] = useState()
  const router = useRouter();
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isPending, startTransition] = useTransition()
  const navRef = useRef(null);
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (loading) {
      setNavData(commonNavData)
    }
    else {
      setNavData(fetchedUser ? afterLoginNavData : beforeLoginNavData)
    }
  }, [fetchedUser, loggedOut, loading])

  useEffect(() => {
    (async () => {
      if (fetchedUser) {
        const userSocket = await io(`${process.env.NEXT_PUBLIC_server}/?userId=${fetchedUser?.username}`);
        setSocket(userSocket);
      }
    })();
  }, [fetchedUser]);


  useEffect(() => {
    if (socket && fetchedUser && fetchedUser?.isAdmin) {
      socket.on('newReport', (newNotification) => {
        setAllNotifications((prev) => [newNotification, ...prev]);
        setNotificationsCount((prev) => prev ? prev + 1 : 1)
      });
    }
    return () => {
      if (socket) {
        return socket?.off("newReport")
      }
    }
  }, [socket, fetchedUser, setAllNotifications, setNotificationsCount])


  useEffect(() => {
    if (socket && fetchedUser) {
      socket.emit('join', { username: fetchedUser?.username });
      socket.on('newCommentNotification', (newNotification) => {

        if (allNotifications?.length > 0) {
          setAllNotifications((prev) => [newNotification, ...prev]);
        }
        else {
          setAllNotifications([newNotification])
        }
        if (newNotification?.commentAuthor?.length > 0 && newNotification?.commentAuthor[0]?.username !== fetchedUser?.username) {
          setNotificationsCount((prev) => prev ? prev + 1 : 1);
        }
      });
    }
    return () => {
      return socket?.off("newCommentNotification")
    }
  }, [fetchedUser, setAllNotifications, setNotificationsCount, socket, allNotifications]);

  useEffect(() => {
    if (fetchedUser) {
      startTransition(() => {
        router.refresh()
      });
    }
  }, [fetchedUser, router, loggedOut]);
  useEffect(() => {
    startTransition(() => {
      router.refresh()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotificationMenu &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setShowNotificationMenu(!showNotificationMenu);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotificationMenu]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!fetchedUser || !showNotificationMenu) return;
    const getNotifications = async () => {
      setLoadingNotifications(true)
      const url = `/api/lasttennotification?username=${fetchedUser?.username}`
      const response = await fetch(url);
      const data = await response.json();

      setAllNotifications(data)
      setLoadingNotifications(false);
      const unreadCount = data?.filter((n) => n?.read === false)?.length || 0
      if (unreadCount > 0) {
        setNotificationsCount(unreadCount)
      }
    }
    getNotifications();
  }, [showNotificationMenu, fetchedUser, setAllNotifications, setNotificationsCount])

  const handleBellClick = () => {
    setShowNotificationMenu(!showNotificationMenu)
    setNavToggle(false)
  }
  const handleBarClick = () => {
    setNavToggle((pre) => !pre)
    setShowNotificationMenu(false);
  }
  const handleNotificationsClick = async (id, read, commentID = null, replyID = null) => {
    if (!fetchedUser) {
      return;
    }
    if (read === false) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, username: fetchedUser.username }),
      };
      const response = await fetch('/api/readnotification', requestOptions);
      const data = await response.json();
      if (data.status === 200) {
        const totalNotificationFromPostID = allNotifications?.filter((n) => n?.postID === id && n?.read === false)?.length || 1;

        setAllNotifications(
          allNotifications?.map((notification) => {
            if (notification?.postID === id) {
              return { ...notification, read: true };
            }
            return notification;
          })
        );
        setNotificationsCount((prev) => prev > 1 ? prev - totalNotificationFromPostID : 0)
      }
    }
    setShowNotificationMenu(false)
    if (replyID) {
      return router.push(`/${id}?commentID=${commentID}&replyID=${replyID}`, { scroll: false })
    }
    else if (commentID) {
      return router.push(`/${id}?commentID=${commentID}`, { scroll: false })
    }
    else {
      router.push(`/${id}`,)
    }
  };

  const clickSeeAll = () => {
    setShowNotificationMenu(false);
    return router.push("/notifications");
  }
  // if (loading) {
  //   return <LoadingNavbar />
  // }
  // const logoSrc = theme === "dark" ? logoForDarkMode : logoForDayMode;
  const logoSrc = logoForDarkMode;
  return (
    <div className="flex min-h-[50px] md:px-10 px-2 justify-between items-center shadow-xl font-semibold z-50" ref={navRef}>
      <Link href={"/"}>
        <Image
          placeholder="blur"
          blurDataURL={`${process.env.NEXT_PUBLIC_BASEURL}/_next/image?${logoForDarkMode}?w=20&h=20`}
          className={`dark:filter w-[150px] h-auto dark:brightness-0 dark:invert py-1 `}
          src={logoSrc}
          unoptimized
          priority={true}
          alt="logo" />
      </Link>
      <div
        className={`z-40 absolute ${navToggle ? "right-0" : "left-[-120%]"
          } top-[4.5rem] w-[40vw] flex justify-center items-center bg-slate-200 py-3 rounded-xl transition-all duration-1000 dark:bg-slate-900 lg:static lg:w-[unset] lg:flex-row lg:bg-transparent lg:pb-0 lg:pt-0 dark:lg:bg-transparent`}
      >
        <ul className="flex flex-col lg:flex-row gap-4 items-center justify-center mr-6" >
          {
            navData?.map(({ path, title }) => <li key={path}>
              <NavLink activeClassName={"text-[#308853] text-semibold"} href={path} exact={path === "/" && true}>{title}</NavLink>
            </li>)
          }
          {
            fetchedUser?.isAdmin && <li><NavLink activeClassName={"text-[#308853] text-semibold"} href={"/admin"}>Admin</NavLink></li>
          }
          {
            fetchedUser?.isAdmin && <li><NavLink activeClassName={"text-[#308853] text-semibold"} href={"/chat"}>Chat</NavLink></li>
          }
          {
            fetchedUser && <li onClick={logOut} className="cursor-pointer" title="Log out from your account">LogOut</li>
          }
          <li>
            <label htmlFor="darkModeToggle" className="swap swap-rotate lg:ml-2">
              <input
                id="darkModeToggle"
                onChange={toggleTheme}
                type="checkbox"
                checked={theme === "dark"}
              />
              <svg
                className="swap-on h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
              <svg
                className="swap-off h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
              <span className="sr-only">Dark Mode</span>
            </label>
          </li>
          {
            fetchedUser && <div className="lg:block hidden">
              <div tabIndex={0} role="button">
                <div className=" relative">
                  <BellIcon
                    count={5}
                    title={"notifications"}
                    handleOnclick={() => setShowNotificationMenu(!showNotificationMenu)}
                    fill={notificationsCount > 0 ? "#f60002" : "#000000"}
                  />

                  <div className="text-red-400 absolute -right-[30%] cursor-default  font-semibold -top-[40%] text-[10px]">{notificationsCount > 0 ? notificationsCount : ""}</div>
                </div>
              </div>
            </div>
          }
        </ul>
      </div>
      {
        fetchedUser && showNotificationMenu && <div className={`rounded-md px-1 z-50 shadow-xl absolute mx-2 right-0 top-14 w-[70vw] bg-gray-300 transition-all duration-1000 dark:bg-slate-900 lg:w-[unset] lg:bg-white text-sm dark:lg:bg-slate-900 max-h-[80vh] overflow-auto scrollforchat`}>
          {loadingNotifications ?
            <LoadingNotifications />
            : allNotifications.length > 0 ? <ul>
              {allNotifications && allNotifications.length > 0 && allNotifications?.map((n, index) => (
                <li
                key={index}
                  onClick={() => handleNotificationsClick(n?.postID, n?.read, n?.commentID, n?.replyID)}
                  title={`On ${formatDateInAdmin(new Date(n?.date))}`}
                  className={`p-2 font-normal  rounded-lg lg:hover:bg-slate-800 lg:hover:text-white cursor-pointer my-2 ${n.read === false ? "dark:text-white" : "text-gray-400 lg:hover:text-gray-400"
                    }`}
                > 
                    <div className="flex gap-[6px] items-center">
                      {n?.author?.photoURL ?
                        <Image src={n?.author?.photoURL} blurDataURL='' alt={`profile photo of ${n?.author?.name}`}
                          width={30} height={0} priority={true}
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: '50%',
                          }}
                          className='border-gray-400 border-[1.5px]'
                        />
                        : <div className='flex items-center justify-center rounded-full border-gray-400 border-[1.5px] w-[25px] h-[25px] p-[4px]'>
                          <UserIcon width={"25px"} height={"25px"} />
                        </div>
                      }
                      <div className="flex flex-col">
                        <p>
                          {notificationMaker(n?.author?.name, n?.type, n?.commentAuthor && n?.commentAuthor[0]?.username, n?.postAuthor && n?.postAuthor[0]?.username, fetchedUser?.username, n?.content)}
                        </p>
                        <p className={`text-[10px] ${n.read === false ? "text-blue-600" : "text-gray-400"} `}>
                          {formatRelativeDate(new Date(n.date)) + " ago"}
                        </p>
                      </div>
                    </div>
                </li>
                
              ))}
              {
                allNotifications?.length < 1 ? <li className="p-2 font-normal  rounded-lg lg:hover:bg-slate-500 lg:hover:text-white cursor-pointer my-1 text-center dark:bg-slate-950">No notification available</li> : <li onClick={clickSeeAll} className="p-2 font-normal  rounded-lg lg:hover:bg-slate-800 lg:hover:text-white cursor-pointer my-1 text-center dark:bg-slate-800 dark:lg:hover:bg-slate-700">See All</li>
              }
            </ul> : <p className="text-center py-2 px-2">No notifications</p>}
        </div>
      }

      <div className="lg:hidden flex items-center">
        {
          fetchedUser && <div className="lg:hidden">
            <div tabIndex={0} role="button" className="">
              <div className=" relative">
                <BellIcon
                  count={5}
                  title={"notifications"}
                  handleOnclick={handleBellClick}
                  fill={notificationsCount > 0 ? "#f60002" : "#000000"}
                />
                <div className="text-red-400 absolute -right-[30%] cursor-default  font-semibold -top-[40%] text-[10px]">{notificationsCount > 0 ? notificationsCount : ""}</div>
              </div>
            </div>
          </div>
        }

        <label className="swap-rotate swap btn-ghost btn-circle btn ml-2 bg-white dark:bg-slate-800 lg:hidden">
          <input
            checked={navToggle}
            onChange={handleBarClick}
            type="checkbox"
          />
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>

      </div>
    </div>

  );
};

export default Navbar;