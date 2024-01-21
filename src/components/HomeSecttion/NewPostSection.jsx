'use client'
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
import NewPost from "./NewPost";

const NewPostSection = () => {
    const { fetchedUser } = useContext(AuthContext);
    if (fetchedUser && !fetchedUser?.blocked) return <NewPost />
};

export default NewPostSection;