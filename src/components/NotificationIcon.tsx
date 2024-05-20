import { IoNotifications } from "react-icons/io5";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Progress } from "@/components/ui/progress"


export default function NotificationIcon() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  function formatTimeAgo(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
  
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  }
  
  async function fetchAvatar(notification) {
    try {
      const fetchImage = await axios.get(`http://localhost:9000/api/getImages?path=${encodeURIComponent(notification.userFrom.userIcon)}`, {
        withCredentials: true,
      });
      notification.userFrom.avatar = `http://localhost:9000/api/getImages?path=${encodeURIComponent(notification.userFrom.userIcon)}`;
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  }
  
  async function processNotifications(response) {
    for (const notification of response) {
        if(notification.notificationMessage.includes('followed')) {
            notification.title = 'New Follower';
        }
      await fetchAvatar(notification);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
        const response = await axios.get("http://localhost:9000/u/getNotifications", {
            withCredentials: true,
        });
        await processNotifications(response.data);

        setNotifications(response.data);

    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="flex items-center justify-center ease-in-out duration-300">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span>
            <IoNotifications className="cursor-pointer size-[1.7rem] hover:opacity-60 duration-150 ease-in-out" />
          </span>
        </PopoverTrigger>
      <PopoverContent className="bg-zinc-950 mt-3">
        <ScrollArea className="max-h-[20rem] flex flex-col">
        {notifications.length === 0 ? (
            <div className="text-white">Nothing to see here yet</div>
          ) : (
            notifications.map((notification) => (
              <a
                key={notification.id}
                href={`/u/${notification.userFrom.username}`}
                className="flex flex-row gap-4 mt-1 mb-1 border-zinc-50 hover:opacity-60 duration-150 ease-in-out"
              >
                <Avatar>
                  <AvatarImage className="bg-white" src={notification.userFrom.avatar}></AvatarImage>
                </Avatar>
                <div className="grid grid-cols-4">
                  <h4 className="font-bold leading-none col-span-3 text-white">{notification.title}</h4>
                  <small className="text-white col-span-1 text-[.55rem] justify-self-end">{formatTimeAgo(notification.createdAt)}</small>
                  <p className="text-sm col-span-4 text-zinc-200 text-muted-foreground">{notification.userFrom.username + " " + notification.notificationMessage}</p>
                </div>
              </a>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
    </div>
  );
}