import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { MdInfoOutline } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { PiLinktreeLogoFill } from "react-icons/pi";

export default function About() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="border-b-[.025em] pb-3 flex flex-row gap-2 items-center hover:font-bold cursor-pointer">
                    <MdInfoOutline />
                    <span>About</span>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 w-[90%] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center gap-5">
                        <h1>About Instaz0rd</h1> 
                        <img src="/src/assets/logo-iz0.png" className="w-[1.5rem]"/>
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <DialogDescription className="grid grid-cols-2 text-zinc-400 gap-5">
                    <p className="col-span-1">Instaz0rd is a social media platform created by <a href="https://github.com/enz0rd" className="font-bold" title="Access my github">enz0rd</a> for educational purposes.</p>
                    <p className="col-span-1">It is a simple platform where you can share your stories, posts and follow other users.</p>
                    <h1 className="font-bold text-xl col-span-2 justify-self-center">Creator's social media</h1>
                    <div className="flex flex-row gap-5 col-span-2 text-3xl items-center justify-center">
                        <a href="http://instagram.com/enz0rd" target="_blank" rel="noopener noreferrer" title="lol">
                            <IoLogoInstagram className="hover:fill-white hover:scale-125 duration-300 ease-out"/>
                        </a>
                        <a href="http://x.com/megab_07" target="_blank" rel="noopener noreferrer">
                            <FaSquareXTwitter className="hover:fill-white hover:scale-125 duration-300 ease-out"/>
                        </a>
                        <a href="http://github.com/enz0rd" target="_blank" rel="noopener noreferrer">
                            <FaGithub className="hover:fill-white hover:scale-125 duration-300 ease-out"/>
                        </a>
                        <a href="http://linktr.ee/megab_07" target="_blank" rel="noopener noreferrer">
                            <PiLinktreeLogoFill className="hover:fill-white hover:scale-125 duration-300 ease-out"/>
                        </a>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}