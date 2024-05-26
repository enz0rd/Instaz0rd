import React, { Suspense, useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getCookie } from "@/pages/Home";
import Settings from "./Settings";
import axios from 'axios';
import CreateStory from "./CreateStory";
import { IoMenu } from "react-icons/io5";
import About from "./About";
import { MdLogout } from "react-icons/md";

// Lazy-load the CreatePost component
const CreatePost = React.lazy(() => import("@/components/CreatePost"));

export default function MenuOpen() {
  const [userImage, setUserImage] = useState('');
  const userDataBefore = getCookie('user');
  let userDataFormatted;
  if(userDataBefore?.startsWith(`j%3A`)) {
    userDataFormatted = decodeURIComponent(userDataBefore.substring(4));
  } else {
    userDataFormatted = decodeURIComponent(userDataBefore);
  }
  const userData = JSON.parse(userDataFormatted);

  useEffect(() => {
    const userIconPath = localStorage.getItem('userIcon');
    if (userIconPath) {
      axios.get(`http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        const imageUrl = `http://localhost:9000/api/getImages?path=${encodeURIComponent(userIconPath)}`;
        setUserImage(imageUrl);
      }).catch((error) => {
        console.error("Error loading user image:", error);
      });
    }
  }, []);

  return (
    <div>
      <div className="h-full w-[100%] flex flex-col gap-3 bg-zinc-950 dark:bg-white">
        <div>
          <h1 className="text-4xl text-zinc-50 mb-5">Menu</h1>
        </div>
        <a href={`/u/${userData.username}`} className="pl-4 flex flex-row gap-2 items-center">
          <img id="user-image" src={userImage} alt="User Icon" className="h-[3rem] w-[3rem] rounded-full object-cover bg-white" />
          <div className="flex flex-col">
            <h3 className="text-md font-bold">{userData.name}</h3>
            <small>{userData.username}</small>
          </div>
        </a>
        <div className="border-[.025em] pl-3 pr-3 pb-4 rounded-2xl flex flex-col gap-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex flex-row gap-1 items-center">
                  <TiPlus className="text-xl" />
                  <span>Create</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5">
                <Suspense fallback={<div>Loading...</div>}>
                  <CreatePost />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                  <CreateStory />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
          <About />          
          <a href="/logout" className="flex flex-row items-center gap-2 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold">
            <MdLogout />
            <p>Logout</p>
          </a>
        </div>
      </div>
    </div>
  );
}
