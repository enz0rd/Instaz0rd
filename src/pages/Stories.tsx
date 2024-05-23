import Header from "@/components/Header";


export default function Stories() {

    return (
        <>
        { window.innerWidth > 768 ? (
                <Header />
            )
        }
            <div className="h-screen flex items-center justify-center mt-10">
                <div className="absolute top-[6rem] flex gap-3 items-center scale-[50%]">
                    <div className="w-[4rem] h-[4rem] rounded-full bg-zinc-50" />
                    <h1 className="text-4xl text-zinc-50 text-center">User</h1>
                </div>
                <img src="/api/src/assets/under-construction.png" alt="Under construction" className="h-[90%] border-zinc-50 border-2 aspect-story w-[90%] rounded-xl bg-zinc-800 object-cover" />
            </div>
        </>
    )
}