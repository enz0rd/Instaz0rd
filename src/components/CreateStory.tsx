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
import '@/styles/CreateStory.css';
import PostButton from "./PostButton";
import SelectFilePost from "./SelectFilePost";
import { FiPlusCircle } from "react-icons/fi";

export default function CreateStory() {
    const [count, setCount] = useState(0);
    const [validImage, setValidImage] = useState(false);
    const [fileInput, setFileInput] = useState<File | null>(null);

    const handleFileSelect = (fileInput, validImage) => {
        setFileInput(fileInput);
        setValidImage(validImage);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">
                        <div className="flex flex-row gap-2 items-center">
                            <FiPlusCircle className="w-4" />
                            <span>Story</span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent id="CreatePostDialog" className="z-50 bg-zinc-950 dark:bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Create Story</DialogTitle>
                    </DialogHeader>
                    <img alt="Image" id="img-display" src="/src/images/placeholder-image-story.png" className="self-center object-cover border-2 aspect-story rounded-lg bg-zinc-900" />
                    <div className="flex flex-col gap-3 w-[100%]">
                        <Label for="select-file">File</Label>
                        <SelectFilePost onFileSelect={handleFileSelect} />
                        <PostButton type='story' validImage={validImage} fileInput={fileInput}/>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
