import { MdOutlineCopyright } from "react-icons/md";

export default function Footer() {
    return (
        <footer className="flex-row items-center gap-2 bg-zinc-900 text-zinc-50 p-2 rounded-t-[1rem] flex bottom-0 fixed right-0 left-0 justify-center">
            <p>By enz0rd — Instaz0rd </p><MdOutlineCopyright /><p> 2024</p>
        </footer>
    )
}