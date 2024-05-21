import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import '@/styles/CreatePost.css';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectFilePost from "./SelectFilePost";
import { Input } from "./ui/input";
import { getCookie } from "@/pages/Home";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "./ui/scroll-area";
import SaveProfileButton from "./SaveProfileButton";
import { useForm } from "react-hook-form";
import axios from 'axios'
import { SelectBox } from "./select";
import MessageAlert from "./MessageAlert";
import { Button } from "./ui/button";
import SaveProfileIcon from "./SaveProfileIcon";
import { get } from "http";

const formSchema = (formData) => z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters long.",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long.",
    }),
    bio: z.string().optional(),
    phonenum: z.string().min(11, {
        message: "Phone number must be at least 11 characters long.",
    }),
});

export default function CreatePost() {
    const [msgalert, setAlert] = useState({ title: '', message: '', isVisible: false });
    const [validImage, setValidImage] = useState(false);
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [userImage, setUserImage] = useState('');

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

    let userData = '';
    if(getCookie('user')?.startsWith('j%3A')) {
        userData = JSON.parse(decodeURIComponent(getCookie('user').substring(4)));
    } else {
        userData = JSON.parse(decodeURIComponent(getCookie('user')));
    }

    const [formData, setForm] = useState({
        name: userData.name,
        username: userData.username,
        bio: userData.bio || null,
        phonenum: userData.phonenum,
    });

    const handleFileSelect = (fileInput, validImage) => {
        setFileInput(fileInput);
        setValidImage(validImage);
    };

    function resetPassword() {
        const confirmDialog = confirm('Are you sure you want to reset your password?');
        if (confirmDialog) {
            console.log("Reset password");
        }
    }

    function changeCountry() {
        const confirmDialog = confirm('Are you sure you want to change your country?');
        if (confirmDialog) {
            console.log("Change country");
        }
    }

    const form = useForm({
        resolver: zodResolver(formSchema(formData)),
        defaultValues: {
            name: userData.name,
            username: userData.username,
            bio: userData.bio || '',
            phonenum: userData.phonenum,
        },
    });

    function onSubmit(values) {
        console.log({...values});
        axios.post('http://localhost:9000/updateAccount', {...values}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            // console.log(response.data);
            alert('Account updated successfully.');
            setTimeout(() => {window.location.reload()}, 2000);
        })
        .catch((err) => {
            console.log('Error updating account:', err.response.data);
            alert('Failed to update account. ' + err.response.data.message || 'Please try again later');
        });
    }

    return (
        <div>
            <MessageAlert title={alert.title} message={alert.message} isVisible={alert.isVisible} />
            <Dialog>
                <DialogTrigger asChild>
                    <div className="pl-4 transition hover:ease-in-out duration-300 hover:text-zinc-50 hover:font-bold cursor-pointer">Update Profile</div>
                </DialogTrigger>
                <DialogContent id="CreatePostDialog" className="z-50 bg-zinc-950 dark:bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Update Profile</DialogTitle>
                    </DialogHeader>
                    <img alt="User Icon" id="img-display" src={userImage} className="border object-cover rounded-full bg-zinc-900" />
                    <ScrollArea className="flex border-t-[.025em] rounded-t-[.5rem] p-[.5rem] h-[15rem] w-[100%] pr-4">
                        <Form {...form}>
                            <h2 className="font-bold text-xl mt-3">Profile details</h2>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-100 flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your bio" {...field} maxLength={255} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phonenum"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="1212341234" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className="bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50 mt-3" type="submit">Save</Button>
                            </form>
                        </Form>
                        <h2 className="font-bold text-xl mt-3">Other</h2>
                        <div className="flex flex-col gap-3 mt-3">
                            <Label htmlFor="select-file">Profile Image</Label>
                            <div className="flex flex-row items-center truncate justify-between align-">
                                <SelectFilePost onFileSelect={handleFileSelect} />
                                <SaveProfileIcon validImage={validImage} fileInput={fileInput} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            <Label className="w-[16rem]" htmlFor="password">Password</Label>
                            <Button onClick={resetPassword} className="w-[100%] bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50">Reset Password</Button>
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            <Label className="w-[16rem]" htmlFor="country">Country</Label>
                            <Button onClick={changeCountry} className="w-[100%] bg-white text-zinc-900 hover:bg-zinc-950 hover:border-2 hover:text-zinc-50">Change Country</Button>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
