import { useState } from "react";
import PostUnitActions from "../PostUnitActions";

export default function PostHome({ post }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return text.substring(0, limit) + '...';
    };

    return (
        <>
            <div className="bg-zinc-800 rounded-xl p-2">
                <div className="flex justify-between items-center">
                    <a href={`/u/${post.User.username}`} className="flex items-center w-[100%]">
                        <img src={post.User.userIcon} alt="userIcon" className="h-10 w-10 rounded-full" />
                        <div className="flex items-center justify-between w-[100%] ml-2 mr-2">
                            <h1 className="font-bold text-lg">{post.User.username}</h1>
                            <small className="text-xs text-zinc-300">{formatTimeAgo(post.createdAt)}</small>
                        </div>
                    </a>
                </div>
                <div className="mt-2">
                    <img src={post.postContent} alt="postContent" className="rounded-xl aspect-square object-cover w-full" />
                </div>
                <div className="mt-2">
                    <p className="text-zinc-300 break-words">
                        {isExpanded ? post.postDescription : truncateText(post.postDescription, 100)}
                    </p>
                    {post.postDescription.length > 100 && (
                        <button
                            onClick={toggleExpand}
                            className="font-bold text-purple-500 mt-1 mb-1 focus:outline-none"
                        >
                            {isExpanded ? 'See less' : 'See more'}
                        </button>
                    )}
                </div>
                <div className="mt-2 mb-2">
                    <PostUnitActions isSelf={false} postUserUsername={post.User.username} postId={post.id} likes={post.likes} comments={post.comments} />
                </div>
            </div>
        </>
    )

}

function formatTimeAgo(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }
}