"use client";

import {X} from "lucide-react";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import { SessionProvider } from "next-auth/react"
import UserService from "@/server/UserService";


export default function ProfilePage() {
    const session = useSession();
    const schema = z.object({
        email: z.string().email({
            message: "Введите корректную почту"
        }),
        username: z.string().min(5, {
            message: "Имя пользователя должно состоять хотя бы из 5 символов"
        }),
        password: z.string(),
        newPassword: z.string(),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [email, setEmail] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();
    if (session?.data?.user) {
        const form = useForm<z.infer<typeof schema>>({
            resolver: zodResolver(schema),
            defaultValues: {
                email: session.data?.user?.email,
                username: session.data?.user?.username,
                password: "",
                newPassword: "",
            }
        });
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });
    

    interface User {
        id: string | undefined;
        username: string;
        email: string;
    }

    const handleEditSave = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = async () => {
        // сохранение изменений
        if(email && username){
            const updateUser : User = {
                id: undefined,
                username:  username,
                email:  email
            }
            const res = await UserService.saveUser(updateUser)
        }
        else{
            return
        }
        handleEditSave();
    };

    const SubmitPassword = async () => {
        // сохранение пароля
        setIsEditingPassword(!isEditingPassword);
    };

    return (
        <SessionProvider session={useSession()}>
                <main className="flex h-screen w-screen flex-row bg-[#001220]">
                    <div className="w-1/5 flex-col h-screen ]">
                        <svg className="flex-start"
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
                        <svg className="flex-end"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 486.7 488.58">
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
                    </div>
                
                    <div
                        className="flex-grow w-[80%] bg-white flex flex-col items-start h-screen">
                        <div className="h-auto px-6 pt-5 w-full flex mb-5">
                            <span className="font-bold text-2xl">Настройки профиля</span>              
                            <Button size="icon" className="ml-auto" onClick={() => window.location.replace("/calendar")}><X/></Button>
                        </div> 

                        <form onSubmit={handleSubmit((d) => console.log(d))}>  
                            <div className="pl-6 pb-0 flex-grow w-[80%] flex-col">
                                <div className="pb-4 flex-grow flex flex-col gap-4">
                                    <Label>Email</Label>
                                    <Input id="email" value={email} readOnly={isEditing} onChange={(newValue) => setEmail(newValue.target.value)}/>
                                </div>
                                <div className="pb-4 flex-grow flex flex-col gap-4">
                                    <Label>Никнейм</Label>
                                    <Input id="username" value={username} readOnly={isEditing} onChange={(newValue) => setUsername(newValue.target.value)}/>
                                </div>

                                <div>
                                    {isEditingPassword ? (
                                        <div className="pb-4 flex-grow flex flex-col gap-4">
                                            <Label>Введите старый пароль</Label>
                                            <Input value=""/>
                                            <Label>Введите новый пароль</Label>
                                            <Input value=""/>
                                            <Label>Повторите новый пароль</Label>
                                            <Input value=""/>
                                            <div className="h-auto w-[200px] px-6 pt-5 flex flex-row mb-5">
                                                <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white"
                                                    onClick={() => {SubmitPassword();}}>Изменить пароль</Button>
                                                <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white"
                                                     onClick={() => {setIsEditingPassword(!isEditingPassword);}} >Отмена</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-auto w-[200px] px-6 pt-5 flex mb-5">
                                            <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white"
                                                onClick={() => {setIsEditingPassword(!isEditingPassword);}}>Изменить пароль</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        <div className="pl-6 flex-grow w-[80%] flex flex-col gap-4 ">
                                <Label>Отображение времени</Label>
                                <Select>
                                    <SelectTrigger className="w-[258px]">
                                        <SelectValue placeholder="1:00 PM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                                        <SelectItem value="13:00">13:00</SelectItem>
                                    </SelectContent>
                                </Select>        
                        </div> 
                            
                        <div className="pl-6 flex-grow w-[80%] flex flex-col gap-4">
                            <Label>Уведомления по умолчанию за </Label>
                            <div className="pl-12 flex-grow flex w-[80%]">
                                <div>
                                    <input  className="w-6 max-w-xs max-h-xs" type="number" min="1" max="60" />   
                                </div>
                                <div className="pl-20 pb-0">
                                    <Select>
                                        <SelectTrigger className="w-[107px]">
                                            <SelectValue placeholder="ч."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="мин.">мин.</SelectItem>
                                            <SelectItem value="ч.">ч.</SelectItem>
                                            <SelectItem value="д.">д.</SelectItem>
                                            <SelectItem value="нед.">нед.</SelectItem>
                                        </SelectContent>
                                    </Select> 
                                </div>
                            </div> 
                        </div>
                        <div className="h-auto w-[200px] px-6 pt-5 flex mb-5">
                            {isEditing ? (
                                <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white"
                                        onClick={handleEditSave}>Изменить</Button>
                            ) : (
                                <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white"
                                        onClick={onSubmit}>Сохранить</Button>
                            )}
                        </div>                                      
                    </div>
                </main>
        </SessionProvider>
    )
}
