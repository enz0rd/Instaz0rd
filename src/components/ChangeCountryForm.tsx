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
import MessageAlert from "@/components/MessageAlert";
import { SelectBox } from '@/components/select';

const formSchema = z.object({
  password: z.string().min(5, {
    message: "Password field must be filled.",
  }),
});

export default function ChangeCountryForm() {
  const [countries, setCountries] = useState([]);
  const [alert, setAlert] = useState({ title: '', message: '', isVisible: false });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: '',
      password: '',
    },
  });

  useEffect(() => {
    // Fetch countries data from the server
    axios.get('http://localhost:9000/utils/countries')
      .then((res) => {
        const transformedData = res.data.map(country => ({
          value: country.id.toString(),
          label: country.nameCountry,
        }));

        setCountries(transformedData);
      })
      .catch((err) => {
        console.error("Failed to fetch countries", err);
      });
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedCountry = document.querySelector('select').value || "";

    if (!selectedCountry) {
      setAlert({
        title: "Country not selected",
        message: "Please select a country to create your account",
        isVisible: true,
      });
      return;
    }

    await axios.post('http://localhost:9000/u/confirmPassword', { password: values.password }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {
        await axios.post('http://localhost:9000/updateAccount', { countryFrom: selectedCountry }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            setAlert({
              title: res.data.title,
              message: res.data.message + ". Redirecting...",
              isVisible: true,
            });
            setTimeout(() => { window.location.href = '/' }, 3000);
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
              message: "Incorrect password. Please try again.",
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

    console.log(values, { countryFrom: selectedCountry } );
  }

  return (
    <div>
      <MessageAlert title={alert.title} message={alert.message} isVisible={alert.isVisible} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col border-[.025em] border-zinc-50 rounded-lg p-4 space-y-3 fixed z-20 h-fit lg:w-[20%] w-2/3 m-auto inset-x-0 inset-y-0">
            <h1 className="self-center font-bold lg:text-2xl text-xl">Change your country</h1>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select country:</FormLabel>
                <FormControl>
                  <SelectBox data={countries} {...field} />
                </FormControl>
                <FormDescription>Select a country from the list up ahead.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription>Confirm your password to change your country.</FormDescription>
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
