import Header from "@/components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function Stories() {
    const parts = window.location.pathname.split('/');
    const [stories, setStories] = useState([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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

    useEffect(() => {
        document.title = `${parts[2]}'s stories - Instaz0rd`;
        const fetchStories = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/u/getStories?username=${parts[2]}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const { stories } = response.data;
                stories.forEach(story => {
                    const userIconURL = encodeURIComponent(story.userStories.userIcon)
                    const storyContentURL = encodeURIComponent(story.storyContent);
                    story.userStories.userIcon = `http://localhost:9000/api/getImages?path=${userIconURL}`;
                    story.storyContent = `http://localhost:9000/api/getImages?path=${storyContentURL}`;
                    story.createdAt = formatTimeAgo(story.createdAt);
                });
                setStories(stories);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
    
        fetchStories();
    }, []); // Adicionando 'parts' como dependência
    

    const handleBackClick = () => {
        setCurrentStoryIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    let index = 0;
    const handleForwardClick = () => {
        if(index < stories.length - 1) {
            index++;
        } else {
            window.location.href = `/u/${parts[2]}`;
        }
        setCurrentStoryIndex(prevIndex => Math.min(prevIndex + 1, stories.length - 1));
    };

    const handleClose = () => {
        window.location.href = `/u/${parts[2]}`
    }

    return (
        <>
            {stories.length > 0 && (
                <>
                    <Header />
                    <div className="h-screen flex items-center justify-center ml-2 mr-2 mt-10">
                        <div className="absolute top-[6rem] flex gap-3 items-center scale-[50%] bg-zinc-950 rounded-full">
                            <img src={stories[currentStoryIndex].userStories.userIcon} className="w-[4rem] h-[4rem] rounded-full bg-zinc-50" />
                            <h1 className="text-4xl text-zinc-50 text-center pr-5">{stories[currentStoryIndex].userStories.username}</h1>
                            <small className="text-lg text-zinc-50 text-center pr-5">{stories[currentStoryIndex].createdAt}</small>
                        </div>
                        <img src={stories[currentStoryIndex].storyContent} alt="Under construction" className="h-[90%] border-zinc-50 border-2 aspect-story rounded-xl bg-zinc-800 object-cover" />
                    </div>
                </>
            )}
            <div className="absolute top-[50%] w-[100%] justify-between p-4 flex flex-row">
                <FaCircleChevronLeft onClick={handleBackClick} className="bg-zinc-950 border-zinc-950 border-2 scale-125 rounded-full drop-shadow-lg text-xl cursor-pointer"/>
                <FaCircleChevronRight onClick={handleForwardClick} className="bg-zinc-950 border-zinc-950 border-2 scale-125 rounded-full drop-shadow-xl text-xl cursor-pointer"/>
            </div>
            <div className="absolute top-[12.5%] right-4">
                <IoClose onClick={handleClose} title="close" className="bg-zinc-950 border-zinc-950 border-2 scale-125 hover:scale-150 duration-300 rounded-full drop-shadow-xl text-xl cursor-pointer"/>
            </div>
        </>
    );
}
