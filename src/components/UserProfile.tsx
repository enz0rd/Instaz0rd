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
        axios.get(`http://localhost:9000/u/details?username=${encodedUsername}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const userData = response.data;
            console.log("User data:", userData.id)
            document.title = `@${userData.username} - Instaz0rd`;
            document.getElementById('user-name').innerText = userData.name;
            document.getElementById('user-username').innerText = `@${userData.username}`;
            document.getElementById('user-since').innerText = `since ${new Date(userData.createdAt).toLocaleDateString()}`;
            document.getElementById('user-location').innerText = "📍 " + userData.country.nameCountry || '';
            document.getElementById('user-bio').innerText = userData.bio || '';
            
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
            console.log(error)
            document.title = `User not found - Instaz0rd`;
            document.getElementById('user-profile').classList.add('hidden');
            document.getElementById('not-found').classList.remove('hidden');
        });

    });
    
    return (
        <div className="justify-center mx-auto flex">
            <div id="user-profile" className="mt-[7rem] grid grid-cols-4 gap-5 items-center w-[60%]">
                <img id='userProfilePic' alt="user profile pic" className="col-start-2 col-span-1 w-[10rem] h-[10rem] aspect-square object-cover rounded-full" />
                <div className="flex flex-col col-span-2">
                    <h1 className="text-3xl font-bold" id="user-name"></h1>
                    <small id="user-since"></small>
                    <span id="user-username"></span>        
                    <span id="user-location"></span>
                </div>
                <div className="col-span-4">
                    <p id="user-bio" className=" mt-2"></p>
                </div>
            </div>
            <div id='not-found' className="absolute top-[50%] left-0 right-0 ml-auto mr-auto w-[20rem] hidden">
                <h1 className="text-3xl font-bold">User not found</h1>
                <span>Sorry, we couldn't find the user you were looking for.</span>
            </div>
        </div>
    );
}