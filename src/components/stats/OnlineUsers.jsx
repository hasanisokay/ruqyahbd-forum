'use client'
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
import ModalUser from "../ModalUser";

const OnlineUsers = () => {
    const { onlineUsers, anonymousUsers, selectedUsernameToShowDetails, setSelectedUsernameToShowDetails } = useContext(AuthContext)

 return (
    onlineUsers && anonymousUsers && <div className="stats-card">
            <h1 className="statsHeaderTitle">Online Users</h1>
            <p className="text-center">Anonymous User: {anonymousUsers}</p>
            <p className="text-center">Logged Users({onlineUsers?.length})</p>
            <div className="flex flex-wrap gap-2 p-1 items-center">
                {onlineUsers?.map((user, index) => <span onClick={()=>setSelectedUsernameToShowDetails(user)} key={index} className="cursor-pointer bg-base-200 rounded-md p-1">
                    {user}
                </span>)}
            </div>
            {selectedUsernameToShowDetails && <ModalUser />}
             
        </div>
    );
};

export default OnlineUsers;