import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import '@/styles/CreatePost.css';
import UpdateProfile from "./UpdateProfile";

export default function Settings() {

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">Settings</div>
                </DialogTrigger>
                <DialogContent id="CreatePostDialog" className="z-50 bg-zinc-950 dark:bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Settings</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 w-[100%]">
                        <p>change something</p>
                        <UpdateProfile />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
