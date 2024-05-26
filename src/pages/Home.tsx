import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FollowingStories from "@/components/homepage/FollowingStories";
import FollowingPosts from "@/components/homepage/FollowingPosts";
import { FaRegCompass } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import Footer from "@/components/Footer";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function Home() {
    document.title = "Home - Instaz0rd";
    // Obtém o valor do cookie 'token'
    const token = getCookie('token');
    
    // Verifica se o token é inválido ou não existe
    if(!token || token === undefined || token === null) {
        window.location.href = '/signin';
        return null;
    }
    
    return (
        <div className="bg-gradient-to-br h-screen from-zinc-950 via-zinc-850 to-zinc-950 text-slate-50">
            <Header />
            <div className="z-40 lg:flex hidden absolute mt-[2rem] flex-col ml-4">
                <h1 className="text-md font-bold">Welcome to Instaz0rd</h1>
                <small className="text-xs">making your social life simpler.</small>
            </div>
            <div className="flex flex-col items-center lg:ml-[30%] lg:mr-[30%] w-70% p-4 h-screen mt-[3rem]">
                <FollowingStories />
                <div className="mt-[1rem] w-[100%] flex flex-col items-center">
                <Tabs defaultValue="explore" className="flex flex-col w-[100%]">
                    <TabsList className="w-[100%] *:w-[50%] self-center bg-zinc-800 text-zinc-50">
                        <TabsTrigger value="explore" className="flex gap-2 items-center">
                            <FaRegCompass />
                            <p>Explore</p>
                        </TabsTrigger>
                        <TabsTrigger value="following" className="flex gap-2 items-center">
                            <FaUserFriends />
                            <p>Following</p>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="explore">
                        <div className="flex flex-row gap-4 pb-2 w-[100%] border-b-[.025em] items-center justify-center">
                            <FaRegCompass className="scale-150"/>
                            <h1 className="font-bold text-2xl">Explore</h1>
                        </div>
                    </TabsContent>
                    <TabsContent value="following">
                        <FollowingPosts />
                    </TabsContent>
                </Tabs>
                </div>
            </div>
            <Footer />
        </div>
    )
}
