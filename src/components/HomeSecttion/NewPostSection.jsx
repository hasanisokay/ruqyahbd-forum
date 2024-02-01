'use client'
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";

const NewPost = dynamic(() => import("./NewPost"));
const NewPostSection = () => {
    const { fetchedUser } = useContext(AuthContext);
    if (fetchedUser === null) return
    else if (fetchedUser && !fetchedUser?.blocked) return <NewPost />
};

export default NewPostSection;