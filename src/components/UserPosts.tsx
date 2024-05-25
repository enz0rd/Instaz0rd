import React, { useState, useEffect } from "react";
import axios from "axios";
import PostProfileUnit from "./PostProfileUnit";
import '@/styles/PostsProfile.css';
import { Skeleton } from "./ui/skeleton"; // Importe o componente Skeleton

export default function UserPosts() {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    const username = parts[4];
    const [postsList, setPostsList] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento

    useEffect(() => {
        axios.get(`http://localhost:9000/u/posts?username=${username}`, {
            withCredentials: true,
        })
        .then((res) => {
            if (res.data === null || (Array.isArray(res.data) && res.data.length === 0)) {
                document.getElementById('zero-posts').classList.remove('hidden');
            } else {
                setPostsList(res.data);
            }
            setTimeout(() => {setLoading(false)}, 1500) // Atualiza o estado de carregamento
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
            setTimeout(() => {setLoading(false)}, 1500) // Atualiza o estado de carregamento
        });
    }, [username]);

    const renderSkeletons = () => {
        return Array(6).fill().map((_, index) => (
            <div key={index} className="flex flex-col gap-1 p-1">
                <Skeleton className="bg-zinc-600 w-full h-[20rem] rounded-md" />
            </div>
        ));
    };

    return (
        <div id="display-posts" className="flex flex-col w-full mt-5 items-center">
            <h1 className="w-3/5 font-bold text-xl">Posts</h1>
            <div id='scrollareaPosts' className="w-3/5 grid grid-cols-3 gap-3 mt-2 border-t-2 rounded-xl p-2 mb-10">
                {loading ? (
                    renderSkeletons()
                ) : postsList.length === 0 ? (
                    <div id="zero-posts" className="show mt-8">
                        <h1 className="text-3xl font-bold">No posts yet</h1>
                        <span>This user hasn't posted anything yet.</span>
                    </div>
                ) : (
                    postsList.map((post, index) => (
                        <PostProfileUnit
                            isSelf={post.isSelf}
                            postId={post.id}
                            key={index}
                            likes={post.likes}
                            comments={post.comments}
                            user={post.User.username}
                            description={post.postDescription}
                            date={post.createdAt}
                            img={post.postContent} // Use o caminho real da imagem aqui
                        />
                    ))
                )}
            </div>
        </div>
    );
}
