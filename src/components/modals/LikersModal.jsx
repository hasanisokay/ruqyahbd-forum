'use client'
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserIcon from "../SVG/UserIcon";
import { LoadingLikers } from "../LoadingSkeletons/Loaders";

const LikersModal = ({ usernames, setterFunction }) => {
    const [openModal, setOpenModal] = useState(false);
    const [likers, setLikers] = useState([])
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const getLikers = async () => {
            setLoadingUser(true);
            const { data } = await axios.post('/api/likers', { usernames })
            if (data?.status === 404) {
                return toast.error(data?.message)
            }
            setLikers((data?.userData))
            setLoadingUser(false)
        }
        if (usernames) {
            getLikers()
        }
    }, [usernames])

    return (
        <div className="w-72 mx-auto flex items-center justify-center">
            <button id="openLikersModal" onClick={() => setOpenModal(true)} className="hidden"></button>
            <div onClick={() => setOpenModal(false)} className={`fixed flex justify-center items-center z-[100] ${openModal ? 'visible opacity-1' : 'invisible opacity-0'} inset-0 backdrop-blur-sm bg-black/20 duration-100`}>
                <div onClick={(e_) => e_.stopPropagation()} className={`absolute w-80 p-6 text-center bg-white drop-shadow-2xl rounded-lg ${openModal ? 'translate-y-0 opacity-1 duration-300' : 'translate-y-20 opacity-0 duration-150'}`}>
         
                        <div>
                            {!loadingUser && likers?.length > 0 && <div>
                                <h1 className="text-center font-semibold">People who liked this</h1>
                                {

                                    likers?.map((user, index) => <div key={index} className="flex justify-start items-center gap-2 mb-2">
                                        <div className="flex items-center justify-center">
                                            {user?.photoURL ? <Image style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: '50%',
                                            }}
                                                width={30} height={30} src={user?.photoURL} alt="user photo" /> : <div className='flex items-center justify-center rounded-full border-gray-400 border-2 w-[30px] h-[30px]'>
                                                <UserIcon height={"25px"} width={"25px"} />
                                            </div>}
                                        </div>
                                        <div>
                                            <p><span className="text-[14px]">{user?.name}</span></p>
                                            <p className="text-[10px]">@{user?.username}</p>
                                        </div>
                                    </div>)
                                }
                            </div>}
                            {
                                !loadingUser && likers?.length === 0 && <p className="text-center font-semibold">Oho! No one liked this.</p>
                            }
                            {
                                loadingUser && <LoadingLikers />
                            }
                        </div>                    
                </div>
            </div>
        </div>
    )
}

export default LikersModal;