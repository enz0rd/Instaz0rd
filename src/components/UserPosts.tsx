import { ScrollArea } from "@/components/ui/scroll-area"
import PostsProfile from "./PostsProfile"
import '@/styles/PostsProfile.css';

export default function UserPosts() {
    return (
        <div id="display-posts" className="flex flex-col w-[100%] mt-5 items-center justify-around">
            <h1 className="w-[60%] font-bold text-xl">Posts</h1>
            <ScrollArea id='scrollareaPosts' className="w-[60%] mt-2 border-t-2 h-screen rounded-xl p-2">
                <PostsProfile/>
            </ScrollArea>
        </div>
    )
}