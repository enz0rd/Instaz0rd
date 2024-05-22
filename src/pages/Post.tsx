import Header from "@/components/Header";
import PostUnitActions from "@/components/PostUnitActions";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Post() {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    const username = parts[4];
    const postId = parts[5];
    const [post, setPost] = useState(null); // Inicializa como null
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado de erro

    useEffect(() => {
        axios.get(`http://localhost:9000/u/posts/details?username=${username}&postId=${postId}`, {
            withCredentials: true,
        })
        .then((res) => {
            if (!res.data) {
                window.location.href = '/404';
            } else {
                console.log("Post data:", res.data);
                res.data.postContent = `http://localhost:9000/api/getImages?path=${encodeURIComponent(res.data.postContent)}`;
                res.data.createdAt = new Date(res.data.createdAt).toLocaleDateString();
                setPost(res.data);
            }
            setLoading(false); // Finaliza o carregamento
        })
        .catch((error) => {
            if (error.response && error.response.status === 404) {
                window.location.href = '/404';
            }
            console.error("Error fetching post:", error);
            setError(error);
            setLoading(false); // Finaliza o carregamento
        });
    }, [username, postId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading post</div>;
    }

    if (!post) {
        return null; // Evita renderização se o post ainda não estiver carregado
    }

    return (
        <div>
            <Header /> 
            <div className="justify-center mx-auto flex mt-[5rem]">
                <div id="postDialog" className="flex bg-zinc-950 w-full max-w-[1000px] p-0">
                    <div id='postContent' className="flex flex-col md:flex-row gap-5 w-full">
                        <img
                            src={post.postContent}
                            alt=""
                            className="object-cover w-full max-w-[40rem] h-auto rounded-lg aspect-square border-none transition-opacity duration-300 ease-out"
                        />
                        <div className="flex flex-col h-full p-2 w-full md:w-[30rem] justify-between">
                            <div className="flex flex-col items-start mt-2">
                                <a href={`/u/${post.User.username}`} className="text-white">
                                    <h1 className="font-bold text-lg text-white">@{post.User.username}</h1>
                                </a>
                                <p>{post.postDescription}</p>
                                <small>{post.createdAt}</small>
                            </div>
                            <div className="items end mb-5 mt-4">
                                <PostUnitActions postUserUsername={post.User.username} postId={postId} likes={post.likes} comments={post.comments} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
