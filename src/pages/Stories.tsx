import Header from "@/components/Header";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export default function Stories() {

    return (
        <>
        { window.innerWidth > 768 ? (
            <>
                <Header />
                <div className="h-screen flex items-center justify-center ml-2 mr-2 mt-10 ">
                    <div className="absolute top-[6rem] flex gap-3 items-center scale-[50%]">
                        <div className="w-[4rem] h-[4rem] rounded-full bg-zinc-50" />
                        <h1 className="text-4xl text-zinc-50 text-center">User</h1>
                    </div>
                    <img src="/api/src/assets/under-construction.png" alt="Under construction" className="h-[90%] border-zinc-50 border-2 aspect-story rounded-xl bg-zinc-800 object-cover" />
                </div>
            </>
            ) : (
                <>
                    <div className="h-screen flex items-center justify-center ml-2 mr-2 ">
                        <div className="absolute top-[1rem] flex gap-3 items-center scale-[50%]">
                            <div className="w-[4rem] h-[4rem] rounded-full bg-zinc-50" />
                            <h1 className="text-4xl text-zinc-50 text-center">User</h1>
                        </div>
                        <div>
                        </div>
                        <img src="/api/src/assets/under-construction.png" alt="Under construction" className="h-screen aspect-story bg-zinc-800 object-cover" />
                    </div>
                </>
            )
        }
            <div className="absolute top-[50%] flex flex-row">
                <FaCircleChevronLeft className="absolute left-[2rem]"/>
                <FaCircleChevronRight className="absolute right-[6rem]"/>
            </div>
        </>
    )
}