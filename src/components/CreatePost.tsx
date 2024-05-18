import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
  

export default function CreatePost() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">Open</div>
            </DialogTrigger>
            <DialogContent className="w-[] bg-zinc-950 dark:bg-white">
                <DialogHeader>
                <DialogTitle className="text-lg">Create Post</DialogTitle>
                <DialogDescription className="flex flex-row gap-5 ">
                    <img alt="Image" id="img-display" src="" className="bg-zinc-900 w-[20rem] h-[20rem]" />
                    <div className="flex flex-col gap-3">
                        <Input type="file"></Input>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}