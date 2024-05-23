import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

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

export default function PostButton({ type, validImage, fileInput }) {
    
    async function Post() {
        if (!validImage) {
            alert('Please select a valid image');
            return;
        }
        
        const formData = new FormData();
        if(type === 'story') {
            formData.append('storyContent', fileInput);
            
            document.getElementById('post-button').classList.add('cursor-not-allowed', 'opacity-50');
            document.getElementById('post-button').setAttribute('disabled', 'true');
            try {
                await axios.post('http://localhost:9000/u/createStory', formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    alert('Story submitted successfully');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                })
                .catch((error) => {
                    console.error('Error submitting story:', error.response.data);
                    alert('Failed to submit story. Please try again later.');
                    document.getElementById('post-button').classList.remove('cursor-not-allowed', 'opacity-50');
    
                });
            } catch (error) {
                console.error('Error submitting story:', error);
                alert('Failed to submit story. Please try again later.');
                document.getElementById('post-button').classList.remove('cursor-not-allowed', 'opacity-50');
    
            }
        } else if(type === 'post') {
            const description = document.getElementById('description') as HTMLTextAreaElement;
            console.log(description.value);

            if (description.value === '') {
                const descConfirm = confirm('The post has no description, are you sure you want to post it?');
                if (!descConfirm) {
                    return;
                }
            }
            formData.append('postDescription', description.value);
            formData.append('postContent', fileInput);
            
            document.getElementById('post-button').classList.add('cursor-not-allowed', 'opacity-50');
            document.getElementById('post-button').setAttribute('disabled', 'true');
            try {
                await axios.post('http://localhost:9000/u/createPost', formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    alert('Post submitted successfully');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                })
                .catch((error) => {
                    console.error('Error submitting post:', error.response.data);
                    alert('Failed to submit post. Please try again later.');
                    document.getElementById('post-button').classList.remove('cursor-not-allowed', 'opacity-50');
    
                });
            } catch (error) {
                console.error('Error submitting post:', error);
                alert('Failed to submit post. Please try again later.');
                document.getElementById('post-button').classList.remove('cursor-not-allowed', 'opacity-50');
    
            }
        }
    }

    return (
        <Button onClick={Post} id="post-button" className="bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50">Post</Button>
    )
}
