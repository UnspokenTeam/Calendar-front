"use client";

import {Plus, X} from "lucide-react";
import React, {useState} from "react";
import {Calendar} from "@/components/ui/calendar";
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
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';


export default function HomePage() {
    return (
        <main className="flex h-screen w-screen flex-col bg-[#001220]">
            
           
            <div
                className="flex-grow w-[80%] bg-white flex flex-col items-start h-screen">
                <div
                    className="h-auto px-6 pt-5 w-full flex mb-5">
                    <span className="font-bold text-2xl">Настройки профиля</span>
                    <Button size="icon" className="ml-auto"><X/></Button>
                </div> 
                <div className="pl-6 pb-0 flex-grow w-[80%] flex-col">
                    <div className="pb-4 flex-grow flex flex-col gap-4">
                        <Label>Mail</Label>
                        <Input value="user@email.com"/>
                    </div>
                    <div className="pb-4 flex-grow flex flex-col gap-4">
                        <Label>Никнейм</Label>
                        <Input value="userNickname"/>
                    </div>
                    <div className="pb-4 flex-grow flex flex-col gap-4">
                        <Label>Пароль</Label>
                        <Input value="********"/>
                    </div>
                </div>
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
                    <Label>Продолжительность мероприятия по умолчанию</Label>
                    <div className="pl-12 flex-grow flex w-[80%]">
                        <div>
                            <Carousel className="w-6 max-w-xs max-h-xs" >
                                <CarouselContent>
                                    {Array.from({ length: 60 }).map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1 w-[20px]">
                                                <span className="text-l font-semibold">{index + 1}</span>     
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        <div className="pl-20">
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
                <div className="pl-6 flex-grow w-[80%] flex flex-col gap-4">
                    <Label>Уведомления по умолчанию за </Label>
                    <div className="pl-12 flex-grow flex w-[80%]">
                        <div>
                            <Carousel className="w-6 max-w-xs max-h-xs" >
                                <CarouselContent>
                                    {Array.from({ length: 60 }).map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1 w-[20px]">
                                                <span className="text-l font-semibold">{index + 1}</span>     
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
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
                <div
                    className="h-auto w-[200px] px-6 pt-5 flex mb-5">
                    <Button className="bg-[#E1EAFF] text-[#0F172A] hover:text-white">Изменить</Button>
                </div>                                         
            </div>
        </main>
        )
    }

