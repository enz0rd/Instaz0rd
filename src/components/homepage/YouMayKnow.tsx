import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

export default function YouMayKnow() {
    const [Users, setUsers] = useState([])
    const [Loading, setLoading] = useState(true)
    
    useEffect(() => {
        // fetch random users
        axios.get('http://localhost:9000/api/randomUsersWithFollowers', {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            console.log(res.data)
            setTimeout(() => {
                setLoading(false)
            }, 5000)
            setUsers(res.data)
        }).catch((err) => {
            setTimeout(() => {
                setLoading(false)
            }, 5000)
            console.error(err)
        })
    }, []);

    return (
        <div className="hidden lg:flex flex-col absolute top-[10rem] ml-10 
        p-4 border-zinc-50 rounded-xl border-[.025em] lg:w-[20%] w-[25%] h-[20rem]
        overflow-hidden">
            <h1 className="font-bold text-xl pb-2 border-b-[.025em]">You may know:</h1>
            <div>
                <ScrollArea className="h-[16rem] rounded-lg">
                    {Loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div className="flex flex-row p-2 items-center gap-3
                            rounded-lg">
                                <Skeleton className="w-[4rem] aspect-square rounded-full bg-zinc-50"/>
                                <div className="flex flex-col gap-1 w-[10rem]">
                                    <Skeleton className="h-[1rem] w-[5rem] bg-zinc-50" />
                                    <Skeleton className="h-[1rem] w-[7rem] bg-zinc-50" />
                                </div>
                            </div>
                        ))
                    ) : Users.length === 0 ? (
                        <div className="flex flex-col p-2 items-center gap-3
                        hover:bg-zinc-700 rounded-lg group duration-300 cursor-pointer">
                            <h1 className="font-bold text-lg">No users found</h1>
                            <p className="text-sm">Please try again later or refresh the page</p>
                        </div>
                    ) : Users.map((user) => (
                        <a href={`/u/${user.username}`} className="flex flex-row p-2 items-center gap-3
                        hover:bg-zinc-700 rounded-lg group duration-300 cursor-pointer">
                            <img src={`http://localhost:9000/api/getImages?path=${user.userIcon}`} className="w-[4rem] aspect-square rounded-full bg-zinc-50"/>
                            <div className="group-hover:font-bold flex flex-col gap-0">
                                <p className="text-lg">{user.name}</p>
                                <p className="text-sm">{user.followers == 1 ? user.followers + " follower" : user.followers + " followers"}</p>
                            </div>
                        </a>
                    ))}
                </ScrollArea>
            </div>
        </div>
    )
}