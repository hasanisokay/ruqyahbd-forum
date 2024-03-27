'use client'
import AuthContext from "@/contexts/AuthContext";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import ModalUser from "../ModalUser";
import "@/../../css/adminStats.css";

const AdminsStat = ({ allAdmins, }) => {
    const { onlineUsers, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails } = useContext(AuthContext)
    const [onlineAdmins, setOnlineAdmins] = useState([])
    const [offlineAdmins, setOfflineAdmins] = useState([])
    useEffect(() => {
        if (allAdmins) {
            setOnlineAdmins(allAdmins?.filter((i) => onlineUsers.includes(i?.username)))
            setOfflineAdmins(allAdmins?.filter((i) => !onlineUsers.includes(i?.username)))
        }
    }, [onlineUsers, allAdmins])
    return (
        <div className="bg-[#fffef9] shadow-xl dark:bg-[#242526] cardinhome py-4 min-h-[300px] mb-4">
            <h1 className="statsHeaderTitle mb-4">Admins</h1>
            <h3 className="text-center my-2">Online Admins ({onlineAdmins?.length})</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {
                    onlineAdmins?.map((user) => <div title={`Click to see ${user?.name}'s profile`} onClick={() => setSelectedUsernameToShowDetails(user?.username)} className="shadow-avatar cursor-pointer" key={user?._id}>
                                 <Image src={user?.photoURL || "https://i.ibb.co/JB4phdq/computer-icons-user-profile-head-ico-download-e2a2cb46bb62fe3f3cd00e0414dd13d6.png"} alt='Admin Profile Photo'
                                    width={100}
                                    placeholder='empty'
                                    height={100}
                                    priority={true}
                                    quality={100}
                                    className={`online-border-color rounded-full object-cover w-[55px] h-[55px] bg-base-200`}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              
                    </div>)
                }
            </div>
            <h3 className="text-center my-2">Offline Admins ({offlineAdmins?.length})</h3>
            <div style={{ '--avatar-count': offlineAdmins?.length }} className="avatars md:gap-0 md:grid flex flex-wrap gap-[1px]">
                {
                    offlineAdmins?.map((user) => <div onClick={() => setSelectedUsernameToShowDetails(user?.username)} title={`Click to see ${user?.name}'s profile`} className="cursor-pointer singleavatar" key={user?._id}>
                        <Image src={user?.photoURL || "https://i.ibb.co/JB4phdq/computer-icons-user-profile-head-ico-download-e2a2cb46bb62fe3f3cd00e0414dd13d6.png"} alt='Admin Profile Photo'
                            width={100}
                            placeholder='empty'
                            height={100}
                            priority={true}
                            quality={100}
                            className={`singleavatar offline-border-color bg-base-200`}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>)
                }
            </div>
            {selectedUsernameToShowDetails && <ModalUser />}
        </div>
    );
};

export default AdminsStat;