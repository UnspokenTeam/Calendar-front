"use client";

import {CalendarIcon, Plus, User} from "lucide-react";
import React, {useState} from "react";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {addHours, format} from 'date-fns';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import FullCalendar from '@fullcalendar/react';
import timeGridWeek from '@fullcalendar/timegrid';
import dayGridMonth from '@fullcalendar/daygrid';
import {createDuration, EventImpl} from "@fullcalendar/core/internal";
import interactionPlugin from '@fullcalendar/interaction';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {TimePickerDemo} from "@/components/ui/time-picker-demo";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {signOut, useSession} from "next-auth/react";

interface Event {
    title: string,
    id: number,
    start: Date,
    end: Date,
    allDay: boolean,
    className: string
}


export default function CalendarPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const handleDate = (date: Date) => {
        setDate((state) => date);
        ref.current?.getApi()?.gotoDate(date);
    }
    const ref = React.useRef<FullCalendar>(null);
    const [open, setOpen] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [event, setEvent] = React.useState<EventImpl | null>(null)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const [events, setEvents] = useState([
        {
            title: 'Example Event',
            id: 1,
            start: new Date(),
            end: addHours(new Date(), 1),
            allDay: false,
            className: "!bg-red-100/50 !border-l-4 !border-r-0 !border-y-0 !border-red-500 !text-red-500 text-xl"
        }
    ]);

    const handleSelectSlot = ({start, end, id}) => {
        const title = window.prompt('New Event Name');
        if (title) {
            setEvents(prevEvents => [
                ...prevEvents,
                {
                    title,
                    id,
                    start,
                    end,
                    allDay: false
                }
            ]);
        }
    };

    return (
        <main className="flex h-screen w-screen flex-col bg-[#001220]">
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="icon" size="icon"><User/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Профиль</DropdownMenuItem>
                        <DropdownMenuItem>Настройки</DropdownMenuItem>
                        <DropdownMenuItem>Подписки</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => await signOut({
                            callbackUrl: "/login",
                            redirect: true
                        })}>
                            Выйти
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="w-auto">
                    <DialogHeader>
                        <DialogTitle>Изменить событие</DialogTitle>
                        <DialogDescription>
                            Не забудьте сохранить изменения!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-1 py-4">
                        <div>
                            <Label>Начало события</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[225px] justify-start text-left font-normal",
                                            !event?.start && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {event?.start ? (
                                            format(event?.start, "PPP HH:mm:ss")
                                        ) : (
                                            <span>Выберите начало</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={event?.start}
                                        onSelect={event?.setStart}
                                        initialFocus
                                    />
                                    <div className="p-3 border-t border-border">
                                        <TimePickerDemo
                                            setDate={event?.setStart}
                                            date={event?.start}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div>
                                        <Label>Конец события</Label>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[225px] justify-start text-left font-normal",
                                                !event?.start && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            {event?.end ? (
                                                format(event?.end, "PPP HH:mm:ss")
                                            ) : (
                                                <span>Выберите конец</span>
                                            )}
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={event?.end}
                                        onSelect={event?.setEnd}
                                        initialFocus
                                    />
                                    <div className="p-3 border-t border-border">
                                        <TimePickerDemo
                                            setDate={event?.setEnd}
                                            date={event?.end}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="col-span-2">
                            <Label>Название события</Label>
                            <Input value={event?.title}/>
                        </div>
                        <div className="col-span-2">
                            <Label>Описание события</Label>
                            <Input/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <div
                className="flex-grow w-full bg-white flex flex-row">
                <div
                    className="flex-grow w-[20%] max-w-[500px] bg-[#E1EAFF] flex flex-col items-center px-[15px] pt-5 space-y-2 h-screen">
                    <div
                        className="h-auto pl-2 w-full flex mb-5">
                        <span className="font-bold text-2xl">Calendar</span>
                        <Button size="icon" className="ml-auto"><Plus/></Button>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDate}
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
                <div className="flex-grow flex flex-col pt-3 max-h-screen   ">
                    <Tabs defaultValue="week" className="flex-grow flex flex-col">
                        <TabsList className=" w-[400px] mx-auto grid grid-cols-3">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                        </TabsList>
                        <TabsContent value="day">
                            Day
                        </TabsContent>
                        <TabsContent value="week" className="flex-grow">
                            <FullCalendar
                                ref={ref}
                                plugins={[timeGridWeek, interactionPlugin, dayGridMonth]}
                                initialView="timeGridWeek"
                                views={{
                                    timeGridWeek: {
                                        type: "timeGrid",
                                        slotDuration: createDuration({
                                            minutes: 15
                                        }),
                                        slotLabelInterval: createDuration({
                                            hours: 1
                                        })
                                    }
                                }}
                                initialDate={date}
                                events={events}
                                eventClick={(event) => {
                                    setEvent(event.event);
                                    setOpenDialog(true)
                                }}
                                eventChange={(event) => console.log(event)}
                                headerToolbar={null}
                                height="100%"
                                eventResizableFromStart
                                droppable
                                editable
                                nowIndicator
                                selectable

                            />
                        </TabsContent>
                        <TabsContent value="month">
                            Month
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    )
        ;
}
