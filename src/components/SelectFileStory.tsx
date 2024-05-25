import { useState } from "react";
import { Label } from "./ui/label";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "./ui/button";
import { FaCropAlt } from "react-icons/fa";

const MIN_WIDTH = 150;
const MIN_HEIGHT = 266;
const ASPECT_RATIO = 9/16;

export default function SelectFileStory({ onFileSelect }) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [error, setError] = useState('');
    const [croppedImage, setCroppedImage] = useState('');
    const [isCropping, setIsCropping] = useState(true);

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageElement = new Image();
            const imageURL = reader.result as string;
            imageElement.src = imageURL;

            imageElement.addEventListener('load', (e) => {
                if (error) setError('');
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth < MIN_WIDTH || naturalHeight < MIN_HEIGHT) {
                    setError("Image must be at least 200px in width and height.");
                    setImgSrc('');
                    onFileSelect(null, false);
                    return;
                }
            });

            setImgSrc(imageURL);
        };
        reader.readAsDataURL(file);
        onFileSelect(file, true); // Pass the file and valid flag immediately after selection
    };

    const cropImage = () => {
        if (!imgSrc) return;

        const image = new Image();
        image.src = imgSrc;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        image.onload = () => {
            const { width, height } = image;
            const cropWidth = (crop.width / 100) * width;
            const cropHeight = (crop.height / 100) * height;
            const cropX = (crop.x / 100) * width;
            const cropY = (crop.y / 100) * height;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], "croppedImage.jpg", { type: "image/jpeg" });
                    setCroppedImage(URL.createObjectURL(croppedFile));
                    setIsCropping(false); // Hide the ReactCrop element
                    onFileSelect(croppedFile, true); // Pass the cropped file and valid flag
                }
            }, 'image/jpeg');
        };
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget; 
        const cropWidthInPercent = (MIN_WIDTH / width) * 100;
        
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
                <Button onClick={cropImage} className="bg-zinc-50 border-[0.025em] border-zinc-50 text-zinc-950 hover:text-zinc-50">
                    <FaCropAlt className="scale-125"/>
                </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {imgSrc && isCropping && (
                <div>
                    <ReactCrop 
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        keepSelection={true}
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_WIDTH}>
                        <img src={imgSrc} alt="Upload" onLoad={onImageLoad} style={{ maxWidth: '100%' }} />
                    </ReactCrop>
                </div>
            )}
            {!isCropping && croppedImage && (
                <div>
                    <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}
