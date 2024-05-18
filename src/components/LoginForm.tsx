import { useState } from 'react';
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form" 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import MessageAlert from "./MessageAlert"

const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters long.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 5 characters long.",
      }),
  })

export default function LoginForm() {
    const [alert, setAlert] = useState({ title: '', message: '', isVisible: false });


    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.post('http://localhost:9000/login', values, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((res) => {
        console.log(res)
        setAlert({
            title: res.data.title, 
            message: res.data.message + ". Redirecting...",
            isVisible: true
        });
        setTimeout(() => { window.location.href='/'}, 3000);
    })
    .catch((err) => {
        setAlert({
            title: "Error", 
            message: err.response ? err.response.data.message : "An error occurred",
            isVisible: true
        })
    })
  }

  return (
    <div>
        <MessageAlert title={alert.title} message={alert.message} isVisible={alert.isVisible} />
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                    <Input placeholder="Username or email" {...field} />
                    </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                </FormItem>
                )}
            />
            <Button className="mt-2 bg-slate-50 text-slate-900 hover:text-slate-50" type="submit">Login</Button>
        </form>
        </Form>
    </div>
  )
}