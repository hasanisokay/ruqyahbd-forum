'use client'
import AuthContext from "@/contexts/AuthContext";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import UserIcon from "../SVG/UserIcon";
import ModalUser from "../ModalUser";

const AdminsStat = ({ allAdmins,  }) => {
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
            <div className="flex flex-wrap justify-center gap-2">
                {
                    onlineAdmins?.map((user) => <div title={`Click to see ${user?.name}'s profile`} onClick={() => setSelectedUsernameToShowDetails(user?.username)} className="flex flex-col items-center justify-center cursor-pointer" key={user?._id}>
                        {
                            user?.photoURL ?
                                <Image src={user?.photoURL} alt='Admin Profile Photo'
                                    width={100}
                                    placeholder='empty'
                                    height={100}
                                    priority={true}
                                    quality={100}
                                    className={`w-[100px] h-[100px] border-2 border-gray-600 online-border-color`}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                : <div className={`flex items-center justify-center w-[100px] h-[100px] online-border-color`}>
                                    <UserIcon height={"100px"} width={"100px"} />
                                </div>
                        }
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs">@{user.username}</p>
                        </div>
                    </div>)
                }
            </div>
            <h3 className="text-center my-2">Offline Admins ({offlineAdmins?.length})</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {
                    offlineAdmins?.map((user) => <div onClick={() => setSelectedUsernameToShowDetails(user?.username)} title={`Click to see ${user?.name}'s profile`} className="flex flex-col items-center justify-center cursor-pointer" key={user?._id}>
                        <div>
                            {
                                user?.photoURL ?
                                    <Image src={user?.photoURL} alt='Admin Profile Photo'
                                        width={100}
                                        placeholder='empty'
                                        height={100}
                                        priority={true}
                                        quality={100}
                                        className={`w-[100px] h-[100px] offline-border-color`}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    : <div className={`flex items-center justify-center w-[100px] h-[100px] offline-border-color`}>
                                        <UserIcon height={"100px"} width={"100px"} />
                                    </div>
                            }
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs">@{user.username}</p>
                        </div>
                    </div>)
                }
            </div>
            {selectedUsernameToShowDetails && <ModalUser />}
             
        </div>
    );
};

export default AdminsStat;