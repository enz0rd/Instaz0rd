import { useState, useEffect } from 'react';
import MenuDrawer from "@/components/MenuDrawer";
import SearchBar from "./SearchBar";
import NotificationIcon from "./NotificationIcon";
import image from '@/assets/logo-iz0.png';
import MenuOpen from "./MenuOpen";

export default function Header() {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1200);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1200);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="bg-zinc-950 dark:bg-white fixed top-0 left-0 right-0 z-50
            border-b-[.025em] rounded-lg p-3 flex flex-row gap-4 justify-around items-center 
            align-middle h-[4rem]">
                <a href="/">
                    <img src={image} className="h-8 w-8" alt="iz0 logo" />
                </a>
                <SearchBar />
                <div className="flex flex-row gap-5">
                    <NotificationIcon />
                    {isLargeScreen ? null : <MenuDrawer />}
                </div>
            </div>
            {isLargeScreen ? (
                <div className="w-[20%] bg-zinc-950 pt-[5rem] pl-7 pr-[3%] border-l-[.025em] border-zinc-50 h-screen fixed right-0">
                    <MenuOpen />
                </div>
            ) : null}
        </>
    );
}
