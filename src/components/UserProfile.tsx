import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { getCookie } from "@/pages/Home";
import '@/styles/UserProfile.css';

export default function UserProfile() {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    const username = parts[4];
    
    useEffect(() => {
        const encodedUsername = encodeURIComponent(username);
        console.log("Encoded username:", encodedUsername)
        axios.get(`http://localhost:9000/u/details?username=${encodedUsername}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const userData = response.data;
            document.title = `@${userData.username} - Instaz0rd`;
            document.getElementById('user-name').innerText = userData.name;
            document.getElementById('user-username').innerText = `@${userData.username}`;
            document.getElementById('user-since').innerText = `User since ${new Date(userData.createdAt).toLocaleDateString()}`;
            
            const userIconPath = userData.userIcon || '/api/src/assets/user-default.png';
            axios.get(`http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                document.getElementById('userProfilePic').src = `http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`;
            })
            .catch((error) => {
                console.error("Error loading user image:", error);
            });
        })
        .catch((error) => {
            document.title = `User not found - Instaz0rd`;
            document.getElementById('user-profile').classList.add('hidden');
            document.getElementById('not-found').classList.remove('hidden');
        });

    });
    
    return (
        <div>
            <div id="user-profile" className="mt-[7rem] flex flex-row gap-10 justify-center items-center">
                <img id='userProfilePic' alt="user profile pic" className="w-[10rem] rounded-full" />
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold" id="user-name"></h1>
                    <span id="user-username"></span>        
                    <span className="text-lg" id="user-since"></span>
                </div>
            </div>
            <div id='not-found' className="absolute top-[50%] left-0 right-0 ml-auto mr-auto w-[20rem] hidden">
                <h1 className="text-3xl font-bold">User not found</h1>
                <span>Sorry, we couldn't find the user you were looking for.</span>
            </div>
        </div>
    );
}