import Header from "@/components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export default function Stories() {
    const parts = window.location.pathname.split('/');
    const [stories, setStories] = useState([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    useEffect(() => {
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

    const handleForwardClick = () => {
        setCurrentStoryIndex(prevIndex => Math.min(prevIndex + 1, stories.length - 1));
    };

    return (
        <>
            {stories.length > 0 && (
                <>
                    <Header />
                    <div className="h-screen flex items-center justify-center ml-2 mr-2 mt-10">
                        <div className="absolute top-[6rem] flex gap-3 items-center scale-[50%]">
                            <img src={stories[currentStoryIndex].userStories.userIcon} className="w-[4rem] h-[4rem] rounded-full bg-zinc-50" />
                            <h1 className="text-4xl text-zinc-50 text-center">{stories[currentStoryIndex].userStories.username}</h1>
                        </div>
                        <img src={stories[currentStoryIndex].storyContent} alt="Under construction" className="h-[90%] border-zinc-50 border-2 aspect-story rounded-xl bg-zinc-800 object-cover" />
                    </div>
                </>
            )}
            <div className="absolute top-[50%] w-[100%] justify-between p-4 flex flex-row">
                <FaCircleChevronLeft onClick={handleBackClick} className="text-xl cursor-pointer"/>
                <FaCircleChevronRight onClick={handleForwardClick} className="text-xl cursor-pointer"/>
            </div>
        </>
    );
}
