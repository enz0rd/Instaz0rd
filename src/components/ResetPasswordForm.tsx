import { useEffect, useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import MessageAlert from "./MessageAlert";
import { SelectBox } from './select';

const formSchema = z.object({
  currentPassword: z.string().min(5, {
    message: "Current password field must be filled and must be at least 5 characters long.",
  }),
  newPassword: z.string().min(5, {
    message: "New password field must be filled and must be at least 5 characters long.",
  }),
  confirmPassword: z.string().min(5, {
    message: "Confirm your password.",
  }),
});

export default function ResetPasswordForm() {
  const [alert, setAlert] = useState({ title: '', message: '', isVisible: false });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios.post('http://localhost:9000/u/confirmPassword', { password: values.currentPassword }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {

        if(values.newPassword !== values.confirmPassword) {
            setAlert({
                title: "Error:",
                message: "Passwords do not match. Please try again.",
                isVisible: true,
            });
            return;
        }

        await axios.post('http://localhost:9000/updateAccount', { password: values.newPassword }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            setAlert({
              title: res.data.title,
              message: res.data.message + ". You must login again, redirecting...",
              isVisible: true,
            });
            setTimeout(() => { window.location.href = '/logout' }, 3000);
          })
          .catch((err) => {
            setAlert({
              title: "Error:",
              message: err.response ? err.response.data.message : "An error occurred",
              isVisible: true,
            });
          });
    })
    .catch((err) => {
        if(err.response.status === 401) {
            setAlert({
              title: "Error:",
              message: "Incorrect current password. Please try again.",
              isVisible: true,
            });
        } else {
            setAlert({
                title: "Error:",
                message: `An error occurred: ${err.response.data.message}`,
                isVisible: true,
            });
        }
        return;
    });
  }

  return (
    <div>
      <MessageAlert title={alert.title} message={alert.message} isVisible={alert.isVisible} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col border-[.025em] border-zinc-50 rounded-lg p-4 space-y-3 fixed z-20 h-fit lg:w-[20%] w-2/3 m-auto inset-x-0 inset-y-0">
            <h1 className="self-center font-bold lg:text-2xl text-xl">Change your password</h1>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password:</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription>Fill your current password to proceed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password:</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription>Fill with your new password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password:</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription>Confirm your new password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-950 
            hover:text-zinc-50 hover:border-[.025em] duration-300 ease-in-out
            font-bold" 
            type="submit">
                Submit
            </Button>
        </form>
      </Form>
    </div>
  );
}
