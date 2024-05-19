import React from "react";
import { MdOutlineOpenInFull } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import PostUnitActions from "./PostUnitActions";
import '@/styles/PostsProfile.css';

export default function PostProfileUnit({ postId, img, description, user, date, likes, comments }) {
    const newDate = new Date(date).toLocaleDateString();

    return (
        <div className="relative border-[.025em] border-zinc-700 rounded-lg w-[33%] bg-zinc-950 cursor-pointer group">
            <img
                src={img}
                alt=""
                className="object-cover w-full h-full rounded-lg aspect-square border-none transition-opacity duration-300 ease-out group-hover:opacity-50"
            />
            <Dialog>
                <DialogTrigger asChild>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                        <MdOutlineOpenInFull className="size-[10%]" />
                        <div className="bg-color-none">Open Post</div>
                    </div>
                </DialogTrigger>
                <DialogContent id="postDialog" className="flex bg-zinc-950 w-full max-w-[1000px] p-0">
                    <div id='postContent' className="flex flex-col md:flex-row gap-5 w-full">
                        <img
                            src={img}
                            alt=""
                            className="object-cover w-full max-w-[40rem] h-auto rounded-lg aspect-square border-none transition-opacity duration-300 ease-out"
                        />
                        <div className="flex flex-col h-full p-2 w-full md:w-[30rem] justify-between">
                            <div className="flex flex-col items-start mt-2">
                                <a href={`/u/${user}`} className="text-white">
                                    <h1 className="font-bold text-lg text-white">@{user}</h1>
                                </a>
                                <p>{description}</p>
                                <small>{newDate}</small>
                            </div>
                            <div className="items end mb-5 mt-4">
                                <PostUnitActions postId={postId} likes={likes} comments={comments} />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
