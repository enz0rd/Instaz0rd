import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import CreatePost from "@/components/CreatePost";
import { getCookie } from "@/pages/Home";

export default function MenuDrawer() {
  const userDataBefore = getCookie('user');
  const userDataFormatted = decodeURIComponent(userDataBefore?.substring(4)); 
  const userData = JSON.parse(userDataFormatted)
  
  return (
    <div >
        <Drawer>
        <DrawerTrigger className="border-t-[.025em] transition ease-out duration-300 hover:scale-110 p-2 rounded-lg">Menu</DrawerTrigger>
        <DrawerContent className="bg-zinc-950 dark:bg-white">
            <DrawerHeader>
                <DrawerTitle className="text-4xl">Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <div className="flex flex-col gap-3">
                <a href={`/u/${userData.id}`}>
                  <div className="pl-4 flex flex-row gap-2 items-center">
                        <img src={userData.userIcon} alt="User Icon" className="h-[3rem] w-[3rem] rounded-full bg-white" />
                        <div className="flex flex-col">
                            <h3 className="text-md font-bold">{userData.name}</h3>
                            <small>{userData.email}</small>
                        </div>
                  </div>
                </a>
                  <CreatePost />
                  <a href="/settings" className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold">Settings</a>
                  <a href="/logout" className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold">Logout</a>
              </div>
            </DrawerDescription>
            <DrawerFooter>
            <DrawerClose>
                <Button className="bg-zinc-950 dark:bg-white" variant="outline">Cancel</Button>
            </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
        </Drawer>
    </div>
  );
}
