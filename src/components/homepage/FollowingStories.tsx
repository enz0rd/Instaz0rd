import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function FollowingStories() {
    const [Stories, setStories] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:9000/u/getStoriesFromFollowedUsers', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.data.usersWithStories.forEach((user) => {
                user.userStories.userIcon = `http://localhost:9000/api/getImages?path=${encodeURIComponent(user.userStories.userIcon)}`;
                console.log('Stories:', user.userStories.username);
            });
            console.log(response.data.usersWithStories)
            setStories(response.data.usersWithStories);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading stories:', error);
            setLoading(false);
        });

        const timer = setTimeout(() => {
            setLoading(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="border-b-[.025em] w-[100%] border-zinc-50 h-[7.8rem]">
            <ScrollArea className="w-[100%] whitespace-nowrap p-2">
                <ScrollBar orientation="horizontal" className="h-[.4rem]" />
                <div className="flex w-max h-max mt-[.3rem] space-x-4">
                    {Loading ? Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="flex flex-col gap-2 items-center">  
                            <Skeleton className="h-[5rem] w-[5rem] aspect-square bg-zinc-400 rounded-full" />
                            <Skeleton className="w-[2rem] h-[1rem] bg-zinc-400" />
                        </div>
                    )) : Stories.length === 0 ? (
                        <div className="flex flex-col gap-2">
                            <h1 className="text-md font-bold mt-5">No stories available :/</h1>
                            <h1 className="text-xs">Start following users to see their stories!</h1>
                        </div>
                    ) : Stories.map((story, index) => (
                        <a key={index} href={`/u/${story.userStories.username}/stories`} className="flex flex-col items-center">
                            <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-400
                            w-full max-w-[10rem] p-[.2rem] rounded-full">
                                <div className="bg-zinc-950 p-[.1rem] rounded-full">
                                    <Avatar className="h-[5rem] w-[5rem] aspect-square rounded-full">
                                        <AvatarImage src={story.userStories.userIcon} alt="avatar" />
                                    </Avatar>
                                </div>            
                            </div>  
                            <small>{story.userStories.username}</small>
                        </a>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
