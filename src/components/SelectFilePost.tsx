import { useState, useRef } from "react";
import { Label } from "./ui/label";

export default function SelectFilePost({ onFileSelect }: { onFileSelect: (file: File | null, validImage: boolean) => void }) {
    const [validImage, setValidImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSelectFile = () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        const imgDisplay = document.getElementById('img-display');
        const labelFile = document.getElementById('label-file');
        let validImage = false;

        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop();
        if (!validExtensions.includes(fileExtension)) {
            alert("Please select a valid file");
            return;
        }

        if (file.size > 5242880) { // 5 MB
            alert("File is too large, please upload a file smaller than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (imgDisplay && e.target) {
                imgDisplay.src = e.target.result as string;
                if (labelFile) labelFile.innerText = file.name.substring(0, 20) + '...';
                setValidImage(true);
            }
        };
        reader.readAsDataURL(file);

        // Call the function passed from the parent
        onFileSelect(file, true);
    }

    return (
        <div className="border-[.025em] rounded-lg p-2">
            <Label className="cursor-pointer w-[90%] overflow-hidden text-ellipsis h-[2rem]" id="label-file" htmlFor="file">Select a file</Label>
            <input ref={fileInputRef} id="file" onChange={onSelectFile} name="file" className="overflow-hidden text-ellipsis hidden" type="file" />
        </div>
    );
}
