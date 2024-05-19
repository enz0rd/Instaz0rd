import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import axios from "axios";
import { useState } from "react";

export default function PostUnitActions({ postId, likes, comments}) {
    const [currentLikes, setCurrentLikes] = useState(likes);

    const handleLikeClick = async () => {
        try {
            await axios.post(`http://localhost:9000/u/likePost`, { postId }, { 
                withCredentials: true 
            }).then((res) => {
                    const likeIcon = document.getElementById('likePost')
                if(likeIcon?.classList.contains('fill-red-600')) {
                    likeIcon.classList.remove('fill-red-600');
                    console.log("Like removed:", res.data);
                    setCurrentLikes(currentLikes - 1);
                } else {
                    likeIcon?.classList.add('fill-red-600');
                    console.log("Post liked:", res.data);
                    setCurrentLikes(currentLikes + 1);
                }
            })

        } catch (error) {
            console.error("Error liking post:", error);
        }
    }

    return (
        <div className="flex flex-row items-center justify-around">
            <div onClick={handleLikeClick} className="cursor-pointer flex flex-row items-center gap-2">
                <AiFillLike id='likePost' className="size-[1.7rem] hover:scale-x-[-1.5] hover:scale-y-[1.5] hover:fill-red-700 duration-300 scale-x-[-1]"/>
                <small>{currentLikes}</small>
            </div>
            <div className="cursor-pointer flex flex-row items-center gap-2">
                <FaRegCommentAlt className="size-[1.5rem] hover:scale-[1.5] duration-300"/>
                <small>{comments}</small>
            </div>
        </div>
    )
}
