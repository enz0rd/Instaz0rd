import { useEffect, useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import MessageAlert from "./MessageAlert";
import { SelectBox } from './select';

const countryValues = (countries) => countries.map(country => country.value);

const formSchema = (countries) => z.object({
  email: z.string().min(10, {
    message: "Email must be valid.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters long.",
  }),
  name: z.string().min(3, {
    message: "User's Name must be at least 3 characters long.",
  }),  
  password: z.string().min(5, {
      message: "Password must be at least 5 characters long.",
    }),
  phonenum: z.string().min(11, {
      message: "Phone number must be at least 11 characters long.",
    }),
});

export default function LoginForm() {
  const [alert, setAlert] = useState({ title: '', message: '', isVisible: false });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch countries data from the server
    axios.get('http://localhost:9000/utils/countries')
      .then((res) => {
        const transformedData = res.data.map(country => ({
          value: country.id.toString(),
          label: country.nameCountry
        }));
        
        setCountries(transformedData);
      })
      .catch((err) => {
        console.error("Failed to fetch countries", err);
      });
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema(countries)),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
      phonenum: "",
      countryFrom: "",
    },
  });

  function onSubmit(values) {
    const selectedCountry = document.querySelector('select').value || "";

    if(!selectedCountry) {
      setAlert({
        title: "Country not selected",
        message: "Please select a country to create your account",
        isVisible: true
      });
      return;
    }

    axios.post('http://localhost:9000/createAccount', { ...values, countryFrom: selectedCountry }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((res) => {
      console.log(res);
      setAlert({
        title: res.data.title, 
        message: res.data.message + ". Redirecting...",
        isVisible: true
      });
      setTimeout(() => {window.location.href='/signin'}, 3000);
    })
    .catch((err) => {
      setAlert({
        title: "Error", 
        message: err.response ? err.response.data.message : "An error occurred",
        isVisible: true
      });
    });
  }
  return (
    <div>
      <MessageAlert title={alert.title} message={alert.message} isVisible={alert.isVisible} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-100 flex-col gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="countryFrom"
            render={({ field }) => (
              <FormItem className='flex flex-col items-start mt-1 gap-1 mb-4'>
                <FormLabel>Country:</FormLabel>
                <FormControl className=''>
                  <SelectBox data={countries} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-slate-50 text-slate-900 hover:text-slate-50" type="submit">Create Account</Button>
        </form>
      </Form>
    </div>
  );
}
