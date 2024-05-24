import { useEffect, useState } from "react";
import axios from "axios";
import '@/styles/UserProfile.css';
import { Skeleton } from "./ui/skeleton"; // Importe o componente Skeleton
import ProfileActions from "./ProfileActions";

export default function UserProfile() {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    const username = parts[4];
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [userData, setUserData] = useState({});

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
            const userIconPath = userData.userIcon || '/api/src/assets/user-default.png';
            userData.imgSource = `http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`
            
            setUserData(userData);
            document.title = `@${userData.username} - Instaz0rd`;
            setTimeout(() => {setLoading(false)}, 1500)
        })
        .catch((error) => {
            console.log(error)
            document.title = `User not found - Instaz0rd`;
            window.location.href = '/404';
            setLoading(false); // Marca o carregamento como concluído mesmo em caso de erro
        });

    }, [username]);

    // Função para renderizar o skeleton de carregamento
    const renderSkeleton = () => (
        <div className="justify-center mx-auto flex">
            <div id="user-profile" className="mt-[7rem] flex flex-col items-center lg:w-[60%] md:w-[80%] sm:w-[90%] mx-auto">
                <Skeleton className="w-full max-w-[10rem] bg-zinc-600 aspect-square object-cover rounded-full" />
                <div className="flex flex-col items-center text-center gap-3 mt-4">
                    <Skeleton className="h-[2.5rem] w-[15rem] bg-zinc-600 text-3xl font-bold" />
                    <Skeleton className="h-[1rem] w-[4rem] bg-zinc-600"/>
                    <Skeleton className="h-[1.5rem] w-[6rem] bg-zinc-600"/>
                    <Skeleton className="h-[1.5rem] w-[6rem] bg-zinc-600"/>
                </div>
                <div className="mt-4 w-full h-[2rem] text-center">
                    <Skeleton className="bg-zinc-600 h-[2rem] mt-2" />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {loading ? renderSkeleton() : (
                <div className="justify-center mx-auto flex">
                    <div id="user-profile" className="mt-[7rem] flex flex-col items-center lg:w-[60%] md:w-[80%] sm:w-[90%] mx-auto">
                        <div className="flex items-center "> 
                            {userData.qtStories > 0 ? (
                                <a href={`/u/${userData.username}/stories`} title="see stories" className="group mr-4">
                                    <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-400
                                    group-hover:scale-105
                                    duration-300 ease-in-out w-full max-w-[10rem] p-[.25rem] rounded-full">
                                        <div className="bg-zinc-950 p-1 rounded-full">
                                            <img id='userProfilePic' src={userData.imgSource} alt="user profile pic" className="aspect-square object-cover rounded-full" />
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <img id='userProfilePic' src={userData.imgSource} alt="user profile pic" className="w-full max-w-[10rem] aspect-square object-cover rounded-full mr-4" />
                            )}
                            <div className="flex flex-col items-start"> {/* Container para informações do usuário */}
                                <h1 className="text-3xl font-bold" id="user-name">{userData.name}</h1>
                                <small id="user-since">{`since ${new Date(userData.createdAt).toLocaleDateString()}`}</small>
                                <span id="user-username">{`@${userData.username}`}</span>        
                                <span id="user-location">{"📍 " + (userData.country.nameCountry || '')}</span>
                                <ProfileActions userData={userData} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <small className="border-[0.025em] border-zinc-50 p-[.5rem] rounded-lg" >Posts {userData.qtPosts}</small>
                            <small className="border-[0.025em] border-zinc-50 p-[.5rem] rounded-lg" >Followers {userData.qtFollowers}</small>
                            <small className="border-[0.025em] border-zinc-50 p-[.5rem] rounded-lg">Following {userData.qtFollowing}</small>
                        </div>
                        <div className="mt-4 w-full text-center"> {/* Container para a bio */}
                            <p id="user-bio" className="text-sm mt-2">{userData.bio || ''}</p>
                        </div>
                    </div>

                    <div id='not-found' className="absolute top-[50%] left-0 right-0 ml-auto mr-auto w-[20rem] hidden">
                        <h1 className="text-3xl font-bold">User not found</h1>
                        <span>Sorry, we couldn't find the user you were looking for.</span>
                    </div>
                </div>
            )}
        </>
    );
}
