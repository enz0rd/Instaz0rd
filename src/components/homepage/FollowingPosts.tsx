import axios from "axios"
import { useEffect, useState } from "react"
import PostHome from "./PostHome"


export default function FollowingPosts() {
    const [Posts, setPosts] = useState([])
    const [Message, setMessage] = useState({ type: '', title: '', message: '', isVisible: false})
    const [Loading, setLoading] = useState(true)


    useEffect(() => {
        axios.get('http://localhost:9000/posts/following', {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async (res) => {
            const posts = res.data
            setPosts(posts)
            setLoading(false);
        })
        .catch((err) => {
            console.error(err)
            setMessage({ type: 'error', title: "Oops, an error occurred", message: 'An error occurred while fetching posts. Please try again later', isVisible: true})
        })

        const timer = setTimeout(() => {
            setLoading(false);
        }, 7000);
    }, [])

    return (
        <>
            {Loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full absolute top-[50%] h-[3rem] w-[3rem] border-t-2 border-b-2 border-zinc-50"></div>
                </div>
            ) : Message.isVisible ? (
                <div className="p-2 border-zinc-50 border-[.025em] m-4 rounded-xl">
                    <h1 className="text-xl font-bold">{Message.title}</h1>
                    <div className="text-zinc-300">{Message.message}</div>
                </div>
            ) : Posts.length === 0 ? (
                <div className="p-2 border-zinc-50 border-[.025em] m-4 rounded-xl">
                    <h1 className="text-xl font-bold">No posts found</h1>
                    <div className="text-zinc-300">No posts found from your friends. Try following more people.</div>
                </div>
            ) : (
                <div className="flex flex-col justify-center mx-auto w-[70%] gap-3 *:aspect-square">
                    {Posts.map((post, index) => (
                        <PostHome key={index} post={post} />
                    ))}
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="font-bold text-xl">That's all!</h1>
                        <p>Want to see more? Follow more people!</p>
                    </div>
                </div>
            )}
        </>
    )
}