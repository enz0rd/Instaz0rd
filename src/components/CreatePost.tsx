import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import '@/styles/CreatePost.css';
import PostButton from "./PostButton";
import SelectFilePost from "./SelectFilePost";
import { FaRegPlusSquare } from "react-icons/fa";

export default function CreatePost() {
    const [count, setCount] = useState(0);
    const [validImage, setValidImage] = useState(false);
    const [fileInput, setFileInput] = useState<File | null>(null);

    const handleFileSelect = (file, valid) => {
        setFileInput(file);
        setValidImage(valid);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">
                        <div className="flex flex-row gap-2 items-center">
                            <FaRegPlusSquare className="w-4" />
                            <span>Post</span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent id="CreatePostDialog" className="z-50 bg-zinc-950 dark:bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Create Post</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 w-[100%]">
                        <Label htmlFor="select-file">Select image</Label>
                        <SelectFilePost onFileSelect={handleFileSelect} />
                        <div className="flex flex-col gap-3 mt-2">
                            <Label className="w-[16rem]" htmlFor="description">Description</Label>
                            <Textarea onChange={e => setCount(e.target.value.length)} id="description" maxLength={255} placeholder="Description of the post" />
                            <small className="mt-[-.5rem]">{count}/255</small>
                        </div>
                        <PostButton type='post' validImage={validImage} fileInput={fileInput}/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
