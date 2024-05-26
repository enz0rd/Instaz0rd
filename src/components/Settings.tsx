import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import '@/styles/CreatePost.css';
import UpdateProfile from "@/components/UpdateProfile";
import { MdSettings } from "react-icons/md";

export default function Settings() {

    return (
        <div>

            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex flex-row gap-2 items-center transition border-b-[0.025em] border-zinc-50 pb-3 hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">
                        <MdSettings />
                        <p>Settings</p>
                    </div>
                </DialogTrigger>
                <DialogContent id="CreatePostDialog" className="z-50 bg-zinc-950 dark:bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            Settings
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 w-[100%]">
                        <p>change something</p>
                        <hr />
                        <UpdateProfile />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
