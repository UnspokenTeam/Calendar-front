"use client";

import {Plus} from "lucide-react";
import React from "react";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function HomePage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <main className="flex h-screen w-screen flex-col bg-[#001220]">
            <div
                className="flex-grow w-full bg-white flex flex-row">
                <div
                    className="flex-grow max-w-[30%] bg-[#E1EAFF] flex flex-col items-center px-[15px] pt-5 space-y-2 h-screen">
                    <div
                        className="h-auto pl-2 w-full flex mb-5">
                        <span className="font-bold text-2xl">Calendar</span>
                        <Button size="icon" className="ml-auto"><Plus/></Button>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border w-f bg-white"
                    />
                    <div className="overflow-y-auto no-scrollbar">
                        <hr className="h-[2px] bg-[#BCBCBC] w-full px-[15px] my-4"/>
                        <div className="flex flex-col w-full max-w-full space-y-3">
                            <div className="self-start">Сегодня 12/01/2024</div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-red-600"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-green-400"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-blue-500"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-yellow-300"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="h-[2px] bg-[#BCBCBC] w-full px-3 my-8"/>
                        <div className="flex flex-col w-full max-w-full space-y-3">
                            <div className="self-start">Завтра 13/01/2024</div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-red-600"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-green-400"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-blue-500"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="h-[24px] w-[24px] shrink-0 rounded-full bg-yellow-300"/>
                                <div className="ml-1">
                                    <div className="flex space-x-2 min-w-fit">
                                        <span>8:15 - 13:40</span>
                                    </div>
                                    <div>
                                        Lorem ipsum
                                    </div>
                                    <div className="text-wrap break-normal text-gray-500">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="h-full w-full flex flex-col pt-3">
                    <Tabs defaultValue="week" className="w-full">
                        <TabsList className=" w-[400px] mx-auto   grid grid-cols-3">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                        </TabsList>
                        <TabsContent value="day">
                            Day
                        </TabsContent>
                        <TabsContent value="week">
                            Week
                        </TabsContent>
                        <TabsContent value="month">
                            Month
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}
