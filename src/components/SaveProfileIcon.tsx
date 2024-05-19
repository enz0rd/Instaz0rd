import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoSaveOutline } from "react-icons/io5";
import axios from "axios";

export default function SaveProfileIcon({ validImage, fileInput }) {
    const [isLoading, setIsLoading] = useState(false);

    async function Save() {
        if (!validImage || !fileInput) {
            alert('Please select a valid image');
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('userIcon', fileInput);

            // Send the FormData object to the server
            await axios.post('http://localhost:9000/updateAccount', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
                localStorage.setItem('userIcon', response.data.imageDir); // Store the file name or path
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            })
            .catch((error) => {
                console.error('Error submitting post:', error.response.data);
                alert('Failed to submit post. Please try again later.');
            });
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('Failed to submit post. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={Save} disabled={isLoading} className="h-[3rem] w-[3rem] bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50">
            {isLoading ? "Saving..." : <IoSaveOutline className="scale-150" />}
        </Button>
    );
}
