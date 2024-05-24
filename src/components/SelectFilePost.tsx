import { useState, useRef } from "react";
import { Label } from "./ui/label";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "./ui/button";
import { FaCropAlt } from "react-icons/fa";

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

export default function SelectFilePost() {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [error, setError] = useState('')

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageElement = new Image();
            const imageURL = reader.result as string;
            imageElement.src = imageURL;

            imageElement.addEventListener('load', (e) => {
                if(error) setError('');
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if(naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be at least 200px in width and height.")
                    setImgSrc('');
                    return;
                }
            });

            setImgSrc(imageURL);
        };
        reader.readAsDataURL(file);

        // Call the function passed from the parent
        // onFileSelect(file, true);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget; 
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
        
        const crop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent, 
            }, 
            ASPECT_RATIO,
            width,
            height
        );

        const centeredCrop = centerCrop(crop, width, height);

        setCrop(centeredCrop);
    };

    return (
        <div>
            <div className="mb-2 border-[.025em] rounded-lg flex items-center justify-between">
                <div>
                    <Label className="cursor-pointer w-[90%] overflow-hidden text-ellipsis h-[2rem] ml-2 mr-2" id="label-file" htmlFor="file">Select a file</Label>
                    <input id="file" accept="image/*" onChange={onSelectFile} name="file" className="overflow-hidden text-ellipsis hidden" type="file" />
                </div>
                <Button className="bg-zinc-50 border-[0.025em] border-zinc-50 text-zinc-950 hover:text-zinc-50">
                    <FaCropAlt className="scale-125"/>
                </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {imgSrc && (
                <div>
                    <ReactCrop 
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        keepSelection={true}
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}>
                        <img src={imgSrc} alt="Upload" style={{ maxHeight: "70vh" }}
                        onLoad={onImageLoad}/>

                    </ReactCrop>
                </div>
            )}
        </div>
    );
}
