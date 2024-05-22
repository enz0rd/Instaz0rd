import { TiPlus, TiMinus } from "react-icons/ti";
import { Button } from "./ui/button";
import UpdateProfile from "./UpdateProfile";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileActions({ userData }) {
    const [follow, setFollow] = useState(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                setFollow(userData.isFollowing);
            } catch (error) {
                console.error("Error checking follow status:", error);
            }
        };

        checkFollowStatus();
    }, [userData.id]);

    const handleFollowClick = async () => {
        try {
            const res = await axios.post(`http://localhost:9000/u/${follow ? 'unfollow' : 'follow'}`, { userId: userData.id }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setFollow(!follow); // Toggle the follow state
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    return (
        <div className="ml-5">
            {userData.isSelf ? (
                <UpdateProfile />
            ) : (
                follow ? (
                    <Button onClick={handleFollowClick} className="mt-2 group text-zinc-50 font-bold hover:text-zinc-50 hover:bg-zinc-50 bg-zinc-950 border-zinc-50 border-[0.025em] duration-300 ease-in-out">
                        <TiMinus className="fill-zinc-50 group-hover:fill-zinc-950 scale-[4rem]"/>
                    </Button>
                ) : (
                    <Button onClick={handleFollowClick} className="mt-2 group text-zinc-950 font-bold hover:text-zinc-50 bg-zinc-50 hover:border-[0.025em] hover:bg-zinc-950 duration-300 ease-in-out">
                        <TiPlus className="fill-zinc-950 group-hover:fill-zinc-50 scale-200"/>
                    </Button>
                )
            )}
        </div>
    );
}
