import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import '@/styles/PostActions.css';
import { Label } from "./ui/label";
import { FaTrash } from "react-icons/fa";

export default function PostUnitActions({ isSelf, postUserUsername,postId, likes, comments }) {
    const [currentLikes, setCurrentLikes] = useState(likes);
    const [currentComments, setCurrentComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

    const currentUrl = window.location.href;
    const parts = currentUrl.split("/");

    useEffect(() => {
        if (currentComments.length === 0) {
            const timeoutId = setTimeout(() => {
                setLoading(false);
            }, 10000);
            return () => clearTimeout(timeoutId);
        } else {
            setLoading(false);
        }
    }, [currentComments]);

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

    const handleLikeClick = async () => {
        try {
            const res = await axios.post(`http://localhost:9000/u/likePost`, { postId }, { withCredentials: true });
            if (res.data.title === "Like added") {
                setCurrentLikes(currentLikes + 1);
            } else {
                setCurrentLikes(currentLikes - 1);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleCommentClick = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/posts/getComments?postId=${postId}`, { withCredentials: true });
            const formattedComments = res.data.map(comment => ({
                ...comment,
                createdAt: formatTimeAgo(comment.createdAt),
                User: {
                    ...comment.commentsUser,
                    userIcon: `http://localhost:9000/api/getImages?path=${encodeURIComponent(comment.commentsUser.userIcon)}`,
                },
            }));
            setCurrentComments(formattedComments);
            setLoading(false);
        } catch (error) {
            console.error("Error getting comments:", error);
        }
    };

    const handleCreateComment = async () => {
        if (newComment.trim().length === 0) return;

        try {
            const res = await axios.post(`http://localhost:9000/posts/createComment`, { postId, comment: newComment }, { withCredentials: true });
            const newCommentData = {
                comment: res.data.comment,
                createdAt: formatTimeAgo(res.data.createdAt),
                User: {
                    username: res.data.userComment.username,
                    userIcon: `http://localhost:9000/api/getImages?path=${encodeURIComponent(res.data.userComment.userIcon)}`,
                },
            };
            currentComments.push(newCommentData)
            setCurrentComments(currentComments);
            setNewComment("");
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    const handleDeletePost = async () => {
        try {
            const resp = await axios.delete(`http://localhost:9000/u/deletePost?postId=${postId}`, { withCredentials: true });
            if(resp.data.title === "Post deleted") {
                alert("Post deleted successfully!");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const commentId = currentComments[0].id;
            const res = await axios.delete(`http://localhost:9000/posts/deleteComment?commentId=${commentId}`, { withCredentials: true });
            if (res.data.title === "Comment deleted") {
                const newComments = currentComments.filter(comment => comment.id !== commentId);
                setCurrentComments(newComments);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    return (
        <div className="flex flex-row items-center justify-around">
            <div onClick={handleLikeClick} className="cursor-pointer flex flex-row items-center gap-2">
                <AiFillLike id='likePost' className={`size-[1.7rem] hover:scale-x-[-1.5] hover:scale-y-[1.5] duration-300 ${currentLikes > likes ? 'fill-red-600' : 'fill-white'} scale-x-[-1]`} />
                <small>{currentLikes}</small>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <div onClick={handleCommentClick} className="cursor-pointer flex flex-row items-center gap-2">
                        <FaRegCommentAlt className="size-[1.5rem] hover:scale-[1.5] duration-300" />
                        <small>{comments}</small>
                    </div>
                </DialogTrigger>
                <DialogContent id="commentDialog" className="bg-zinc-950 w-[90%] border-[.025em]">
                    <DialogHeader className="pb-3 border-b-2 rounded-lg">
                        <DialogTitle className="pl-3">Comments</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <ScrollArea className="h-[25rem] pr-4 pb-4">
                            {loading ? (
                                Array(3).fill().map((_, i) => (
                                    <div key={i} className="flex gap-3 p-4" id='loading-comment'>
                                        <Skeleton className="bg-zinc-600 w-[3rem] h-[3rem] rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="bg-zinc-600 h-4 w-[100px]" />
                                            <Skeleton className="bg-zinc-600 h-4 w-[200px]" />
                                        </div>
                                    </div>
                                ))
                            ) : currentComments.length === 0 ? (
                                <div id="no-comments" className="mx-auto flex flex-col ml-[1rem] mt-[.2rem]">
                                    <h1 className="text-lg text-zinc-50 font-bold">No comments yet...</h1>
                                    <p className="text-zinc-100">Do you want to be the first one?</p>
                                </div>
                            ) : (
                                currentComments.map((comment, index) => (
                                    <div key={index} className="flex gap-3 flex-row mb-2 transition-all hover:bg-zinc-800 hover:border-[.2em] duration-100 ease-out p-4 rounded-lg">
                                        <Avatar className="bg-zinc-950 border-2 w-[3rem] h-[3rem] aspect-square">
                                            <AvatarImage src={comment.User.userIcon} />
                                        </Avatar>
                                        <div className="grid w-[100%] grid-cols-5">
                                            <h4 className="font-bold leading-none col-span-4 text-white">@{comment.User.username}</h4>
                                            <small className="text-white col-span-1 text-[.55rem] justify-self-end">{comment.createdAt}</small>
                                            <div className="text-sm col-span-4 text-zinc-200 text-muted-foreground">{comment.comment}</div>
                                        </div>
                                        {comment.commentIsSelf && (
                                            <div className="flex items-center justify-center">
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <div className="cursor-pointer flex flex-row items-center gap-2">
                                                            <FaTrash className="size-[1rem] fill-white hover:scale-[1.5] duration-300" />
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-zinc-950 w-[90%] border-[.025em] rounded-lg">
                                                        <DialogHeader>
                                                            <DialogTitle>Are you sure?</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogDescription>
                                                            <div className="flex flex-col gap-2">
                                                                <p>This action cannot be undone!</p>
                                                                <Button onClick={handleDeleteComment} className="bg-red-600 hover:bg-red-700">Delete</Button>
                                                            </div>
                                                        </DialogDescription>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                        <div className="grid gap-2 grid-cols-5">
                            <Input className="col-span-4 focus:border-2" value={newComment} onChange={(e) => setNewComment(e.target.value)} id='comment-content' placeholder="Add your comment..." />
                            <Button onClick={handleCreateComment} className="col-span-1 bg-zinc-50 border-[.025em] hover:bg-zinc-950 group">
                                <IoSend className="fill-zinc-950 scale-125 group-hover:fill-zinc-50" />
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger>
                    <IoSend className="size-[1.5rem] hover:scale-[1.5] duration-300" />
                </DialogTrigger>
                <DialogContent id="share-post" className="sm:max-w-md w-[90%] bg-zinc-950">
                    <DialogHeader>
                    <DialogTitle>Share this post</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this post.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                        Link
                        </Label>
                        <Input
                        id="link"
                        defaultValue={`${parts[0]}//${parts[2]}/${parts[3]}/${postUserUsername}/${postId}`}
                        readOnly
                        />
                    </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {isSelf && (
                <Dialog>
                    <DialogTrigger>
                        <div className="cursor-pointer flex flex-row items-center gap-2">
                            <FaTrash className="size-[1.5rem] hover:scale-[1.5] duration-300" />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 w-[90%] border-[.025em] rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <div className="flex flex-col gap-2">
                                <p>This action cannot be undone!</p>
                                <Button onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">Delete</Button>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
