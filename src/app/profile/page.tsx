"use client";

import {Key, Mail, UserRound, X} from "lucide-react";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";


export default function ProfilePage() {
    // const session = useSession();
    const router = useRouter();
    const schema = z.object({
        email: z.string().email({
            message: "Введите корректную почту"
        }),
        username: z.string().min(5, {
            message: "Имя пользователя должно состоять хотя бы из 5 символов"
        }),
    });

    const passwordSchema = z.object({
        password: z.string().min(10, {
            message: "Минимальная длина пароля 10 символов"
        }),
    });

    const userForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            username: "",
        }
    });
    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: ""
        }
    });

    const onSubmit = async () => {

    };

    return (
        <main className="flex h-screen w-screen flex-col bg-[#001220]">
            <svg className="z-0 absolute self-end invisible md:visible md:w-1/2 lg:w-1/3"
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 486.7 486.7">
                <path
                    d="m486.7,486.7c-38-44.1-76-88.3-126.7-96.8s-114,18.7-159.4,3.9c-45.4-14.8-72.7-71.7-87.7-122.2-14.9-50.6-17.4-94.8-34.2-139C61.9,88.4,30.9,44.2,0,0h486.7v486.7Z"
                    fill="#3e3157"/>
                <path
                    d="m486.7,324.5c-25.3-29.4-50.7-58.9-84.5-64.5-33.8-5.7-76,12.4-106.2,2.5-30.3-9.9-48.5-47.8-58.5-81.5-9.9-33.7-11.6-63.1-22.8-92.6S182.9,29.5,162.2,0h324.5v324.5Z"
                    fill="#e1685e"/>
                <path
                    d="m486.7,162.2c-12.7-14.7-25.3-29.4-42.2-32.2-16.9-2.9-38,6.2-53.2,1.3-15.1-5-24.2-23.9-29.2-40.8-5-16.8-5.8-31.6-11.4-46.3s-15.9-29.5-26.2-44.2h162.2v162.2Z"
                    fill="#fbae3d"/>
            </svg>
            <svg className="z-0 absolute self-start bottom-0 invisible md:visible md:w-1/2 lg:w-1/3"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486.7 488.58">
                <path
                    d="m0,1.88C55.9-1.22,111.9-4.22,150.4,25.68c38.5,29.8,59.6,92.4,90.6,131.2,30.9,38.8,71.8,53.6,102.8,81.9,31.1,28.3,52.5,70,74.7,113.8,22.2,43.9,45.2,90,68.2,136H0V1.88Z"
                    fill="#3e3157"/>
                <path
                    d="m0,164.08c37.3-2,74.6-4,100.3,15.9,25.7,19.9,39.7,61.6,60.4,87.5,20.6,25.8,47.8,35.7,68.5,54.6,20.7,18.8,35,46.6,49.8,75.9,14.8,29.2,30.1,59.9,45.5,90.6H0V164.08Z"
                    fill="#e1685e"/>
                <path
                    d="m0,326.38c18.6-1.1,37.3-2.1,50.1,7.9,12.9,9.9,19.9,30.8,30.2,43.7,10.3,13,24,17.9,34.3,27.3,10.4,9.5,17.5,23.4,24.9,38,7.4,14.6,15.1,30,22.7,45.3H0v-162.2Z"
                    fill="#fbae3d"/>
            </svg>

            <div
                className="h-screen w-full md:w-[55%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] bg-white flex flex-col gap-12 px-5 md:max-2xl:rounded-tr-2xl md:max-2xl:rounded-br-2xl pt-2 relative z-1 self-end">
                <div className="h-auto px-6 pt-5 w-full flex mb-5">
                    <span className="font-bold text-2xl">Настройки профиля</span>
                    <Button size="icon" className="ml-auto"
                            onClick={() => router.push("/calendar")}><X/></Button>
                </div>

                <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                        <FormField control={userForm.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Электронная почта
                                </FormLabel>
                                <FormControl>
                                    <Input startIcon={Mail} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} name="email"/>
                        <FormField control={userForm.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Имя пользователя
                                </FormLabel>
                                <FormControl>
                                    <Input startIcon={UserRound} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} name="username"/>
                        <Button className="bg-[#E1EAFF] text-[#0F172A] hover:bg-blue-200 active:bg-blue-300 self-center"
                                type="submit">Сохранить</Button>
                    </form>
                </Form>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-[#E1EAFF] text-[#0F172A] hover:bg-blue-200 active:bg-blue-300 self-center">
                            Изменить пароль
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Изменение пароля
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(() => null)} className="space-y-3 flex flex-col">
                                <FormField control={passwordForm.control} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Пароль</FormLabel>
                                        <FormControl>
                                            <Input startIcon={Key} {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )} name="password"/>
                                <DialogFooter>
                                    <Button type="submit">Сохранить</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

            </div>
        </main>
    )
}
