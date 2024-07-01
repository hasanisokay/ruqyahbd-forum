'use client'
import AuthContext from "@/contexts/AuthContext";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import getUser from "@/utils/getUser";
import getUserIp from "@/utils/getUserIp.mjs";
import generateToken from "@/utils/generateToken.mjs";


const AuthProvider = ({ children }) => {
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [allNotifications, setAllNotifications] = useState([]);
    const [loggedOut, setLoggedOut] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isReportingPost, setIsReportingPost] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingCommentId, setReportingCommentId] = useState(null);
    const [reportingReplyId, setReportingReplyId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [selectedUsernameToShowDetails, setSelectedUsernameToShowDetails] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [anonymousUsers, setAnonymousUsers] = useState(0);
    
    useEffect(() => {
        // const handleSocketConnection = async () => {
        //     try {
        //         if (fetchedUser && !loading) {
        //             const userSocket = await io(`${process.env.NEXT_PUBLIC_server}/?userId=${fetchedUser?.username}`);
        //             setSocket(userSocket);
        //         } else {
        //             const anonymousSocket = await io(process.env.NEXT_PUBLIC_server);
        //             setSocket(anonymousSocket);
        //         }
        //     } catch (error) {
        //         console.error('Socket connection error:', error);
        //     }
        // };
        const handleSocketConnection = async () => {

            try {
                let token;
                const userIp = await getUserIp();
                if (fetchedUser && !loading) {
                    token = await generateToken({ userId: fetchedUser?.username, ip: userIp })
                }
                else {
                    token = await generateToken({ ip: userIp })
                }
                const socketUrl = `https://forumsocket.ruqyahbd.org/?token=${token}`
                const socket = await io(socketUrl);
                setSocket(socket);
            } catch (error) {
                console.error('Socket connection error:', error);
            }
        };

        handleSocketConnection();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchedUser, loading]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { user } = await getUser();
            setLoading(false);
            if (user?.status === 200) {
                setLoggedOut(false);
                setFetchedUser(user.user);
            }

            else {
                setFetchedUser(null)
                return;
            }
        }
        fetchUser()
    }, [loggedOut])

    useEffect(() => {
        if (showDeleteModal) {
            document?.getElementById('deleteModal')?.showModal()
        }
    }, [showDeleteModal])

    useEffect(() => {
        if (showReportModal) {
            document.getElementById('reportModal')?.showModal()
        }
        if (!showReportModal) {
            setIsReportingPost(false)
            setReportingCommentId(null)
            document?.getElementById('reportModal')?.close();
        }
    }, [showReportModal])

    useEffect(() => {
        if (fetchedUser) {
            setNotificationsCount(fetchedUser?.unreadNotificationCount)
        }
    }, [fetchedUser])

    useEffect(() => {
        if (selectedUsernameToShowDetails) {
            document.getElementById('userModal').showModal();
        }
    }, [selectedUsernameToShowDetails]);

    useEffect(() => {
        if (socket) {
            socket.on('userConnected', async ({ anonymousUsersCount, loggedUsers }) => {
                setOnlineUsers(loggedUsers);
                setAnonymousUsers(anonymousUsersCount);
            });

            socket.on('userDisconnected', async ({ anonymousUsersCount, loggedUsers }) => {
                setOnlineUsers(loggedUsers);
                setAnonymousUsers(anonymousUsersCount);
            });

        }
        return () => {
            socket?.off("userConnected")
            socket?.off("userDisconnected")
        }
    }, [fetchedUser, socket])

    const value = {
        fetchedUser,
        setFetchedUser,
        loading,
        setLoading,
        setFetchedUser,
        setLoggedOut,
        loggedOut,
        notificationsCount,
        setNotificationsCount,
        setAllNotifications,
        allNotifications,
        showDeleteModal,
        setShowDeleteModal,
        showReportModal,
        setShowReportModal,
        isReportingPost,
        setIsReportingPost,
        reportingCommentId,
        setReportingCommentId,
        reportingReplyId,
        setReportingReplyId,
        socket,
        onlineUsers,
        anonymousUsers,
        selectedUsernameToShowDetails,
        setSelectedUsernameToShowDetails
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;