import { useState } from "react";
import { Button } from "@/components/ui/button";

// Função para converter um arquivo em um array de bytes
async function fileToBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                const buffer = new Uint8Array(event.target.result);
                resolve(buffer);
            } else {
                reject(new Error('Failed to read file as ArrayBuffer'));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

export default function SaveProfileButton({ validImage, fileInput }) {
    const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);

    async function Post() {
        const description = document.getElementById('description') as HTMLTextAreaElement;
        console.log(description.value);

        if (!validImage) {
            alert('Please select a valid image');
            return;
        }

        // Convert file to bytes
        try {
            const bytes = await fileToBytes(fileInput);
            setImageBytes(bytes);
            const base64String = btoa(String.fromCharCode.apply(null, bytes));
            console.log('Base64 String:', base64String);
        } catch (error) {
            console.error('Error converting file to bytes:', error);
            alert('Failed to convert file to bytes. Please try again.');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('description', description.value);
        formData.append('image', fileInput);

        // Append image bytes to form data
        if (imageBytes) {
            formData.append('imageBytes', new Blob([imageBytes], { type: 'application/octet-stream' }));
        }

        try {
            // Send form data to the server using fetch or any other method
            // const response = await fetch('URL_TO_YOUR_SERVER_ENDPOINT', {
            //     method: 'POST',
            //     body: formData
            // });

            // // Handle response from the server
            // if (response.ok) {
            //     alert('Post submitted successfully!');
            //     // Optionally, clear the form fields or do any other actions after successful submission
            // } else {
            //     alert('Failed to submit post. Please try again later.');
            // }
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('Failed to submit post. Please try again later.');
        }
    }

    return (
        <Button onClick={Post} className="mt-3 w-[100%] bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50">Save</Button>
    )
}
