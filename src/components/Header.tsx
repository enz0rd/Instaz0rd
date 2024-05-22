import MenuDrawer from "@/components/MenuDrawer";
import SearchBar from "./SearchBar";
import NotificationIcon from "./NotificationIcon";
import image from '@/assets/logo-iz0.png';


export default function Header() {
    return (
        <div className="bg-zinc-950 dark:bg-white fixed top-0 left-0 right-0 z-50
        border-b-[.025em] rounded-lg p-3 flex flex-row gap-4 justify-around items-center 
        align-middle h-[4rem]">
            <a href="/">
                <img src={image} className="h-8 w-8" alt="iz0 logo" />
            </a>
            <SearchBar />
            <div className="flex flex-row gap-5">
                <NotificationIcon />
                <MenuDrawer></MenuDrawer>
            </div>
        </div>
    )
}