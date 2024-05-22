import React, { Suspense, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { getCookie } from "@/pages/Home";
import Settings from "./Settings";
import axios from 'axios';

// Lazy-load the CreatePost component
const CreatePost = React.lazy(() => import("@/components/CreatePost"));

export default function MenuDrawer() {
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
    <Sheet>
      <SheetTrigger className="border-t-[.025em] transition hover:opacity-60 duration-150 ease-in-out p-2 rounded-lg">Menu</SheetTrigger>
      <SheetContent className="pb-10 flex flex-col gap-3 bg-zinc-950 dark:bg-white">
        <SheetHeader>
          <SheetTitle className="text-4xl">Menu</SheetTitle>
        </SheetHeader>
        <a href={`/u/${userData.username}`} className="pl-4 flex flex-row gap-2 items-center">
          <img id="user-image" src={userImage} alt="User Icon" className="h-[3rem] w-[3rem] rounded-full object-cover bg-white" />
          <div className="flex flex-col">
            <h3 className="text-md font-bold">{userData.name}</h3>
            <small>{userData.username}</small>
          </div>
        </a>
        {/* Wrap the CreatePost component in Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePost />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Settings />
        </Suspense>
        <a href="/logout" className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold">Logout</a>
      </SheetContent>
    </Sheet>
  );
}
