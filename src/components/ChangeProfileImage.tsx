import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import SaveProfileIcon from "./SaveProfileIcon";
import SelectFilePost from "./SelectFilePost";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function ChangeProfileImage() {
    const [validImage, setValidImage] = useState(false);
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [userImage, setUserImage] = useState('/src/images/placeholder-image.png'); // Define a default image

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png'];
        const validImage = validImageTypes.includes(file.type);
        
        if(!validImage) {
            alert('Please select a valid image file (JPEG or PNG).')
        }
        
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageURL = reader.result?.toString() || '';
            console.log(imageURL);
        });
    }

    useEffect(() => {
        const userIconPath = localStorage.getItem('userIcon');
        if (userIconPath) {
            setUserImage(`http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`);
        }
    }, []);

    return (
        <>
            <Dialog className="w-[20rem]" >
                <DialogTrigger asChild>
                    <Button className="bg-zinc-50 text-zinc-950 hover:text-zinc-50 hover:bg-zinc-950 hover:border-zinc-50 hover:border-[0.025em]">Change profile image</Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col w-[90%] bg-zinc-950 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Change image</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-5 items-center justify-between">
                        <SelectFilePost onFileSelect={onSelectFile} />
                        <SaveProfileIcon validImage={validImage} fileInput={fileInput} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
