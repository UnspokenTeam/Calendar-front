"use client";

import {CalendarIcon, Plus, User} from "lucide-react";
import React from "react";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {addDays, endOfDay, endOfMonth, format, startOfDay, startOfMonth, subDays} from 'date-fns';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator
} from "@/components/ui/command";
import FullCalendar from '@fullcalendar/react';
import timeGridWeek from '@fullcalendar/timegrid';
import dayGridMonth from '@fullcalendar/daygrid';
import {createDuration} from "@fullcalendar/core/internal";
import interactionPlugin from '@fullcalendar/interaction';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {signOut, useSession} from "next-auth/react";
import AddEventDialog from "@/components/add-event-dialog";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {BorderMapper, ColorMapper, Colors, EventColorMapper, Events} from "@/types/Events";
import ViewEventDialog from "@/components/view-event-dialog";
import apiClient from "@/lib/api-client";
import {EventChangeArg} from "@fullcalendar/core";
import {cn} from "@/lib/utils";
import Notifications from "@/components/notifications";

export default function CalendarPage() {
    const session = useSession();
    const [date, setDate] = React.useState<Date>(new Date())
    const today = startOfDay(new Date());
    const handleDate = (date?: Date) => {
        if (date) {
            setDate((state) => date);
            ref.current?.getApi()?.gotoDate(date);
        }
    }
    const ref = React.useRef<FullCalendar>(null);
    const [pallet, setPallet] = React.useState<boolean>(false);
    const [addDialog, setAddDialog] = React.useState<boolean>(false);
    const [viewDialog, setViewDialog] = React.useState<boolean>(false);
    const [id, setId] = React.useState<string>("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setPallet((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const client = useQueryClient();

    const {data: events} = useQuery({
        queryKey: ["events", date],
        queryFn: async (args) => {
            const [_, date] = args.queryKey;
            const res = (await apiClient.get<Events>("events/my/created/", {
                params: {
                    page: 1,
                    items_per_page: -1,
                    start: startOfDay(subDays(startOfMonth(date as Date), 7)),
                    end: endOfDay(subDays(endOfMonth(date as Date), 7)),
                }
            })).data.map((item) => {
                item.id = `${item.id}&${Math.floor(Math.random() * 100)}`
                return item
            })

            return res;

        },
        retry: 3,
    })

    const {data: eventsToday} = useQuery({
        queryKey: ["events", {type: "today"}],
        queryFn: async () => {
            try {
                return (await apiClient.get<Events>("events/my/created/", {
                    params: {
                        page: 1,
                        items_per_page: -1,
                        start: startOfDay(today),
                        end: endOfDay(today),
                    }
                })).data
            } catch {
                return []
            }
        },
        retry: 3,
    })

    const {data: eventsTomorrow} = useQuery({
        queryKey: ["events", {type: "tomorrow"}],
        queryFn: async () => {
            try {
                return (await apiClient.get<Events>("events/my/created/", {
                    params: {
                        page: 1,
                        items_per_page: -1,
                        start: addDays(startOfDay(today), 1),
                        end: addDays(endOfDay(today), 1),
                    }
                })).data
            } catch {
                return []
            }
        },
        retry: 3,
    })

    const {mutateAsync} = useMutation({
        mutationFn: async ({id, start, end}: { id: string, start: Date, end: Date }) => {
            const item = events!.find(x => x.id === id)!;
            item.start = start;
            item.end = end;

            await apiClient.put("events/", {
                ...item,
                id: item.id.split("&")[0]!
            });

            await client.invalidateQueries({
                queryKey: ["events"]
            });
        },
    })

    const handleEventChange = async ({event}: EventChangeArg) => {
        event.start?.setSeconds(0);
        event.end?.setSeconds(0);
        await mutateAsync({id: event.id, start: event.start!, end: event.end!})
    }

    // const handleSelectSlot = ({start, end, id}) => {
    //     const title = window.prompt('New Event Name');
    //     if (title) {
    //         setEvents(prevEvents => [
    //             ...prevEvents,
    //             {
    //                 title,
    //                 id,
    //                 start,
    //                 end,
    //                 allDay: false
    //             }
    //         ]);
    //     }
    // };

    return (
        <main className="flex h-screen w-screen flex-col bg-[#001220]">
            <Notifications/>
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="icon" size="icon"><User/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Профиль</DropdownMenuItem>
                        <DropdownMenuItem>Настройки</DropdownMenuItem>
                        <DropdownMenuItem>Подписки</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={async () => await signOut({
                            callbackUrl: "/login",
                            redirect: true
                        })}>
                            Выйти
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <AddEventDialog open={addDialog} setOpen={setAddDialog}/>
            <ViewEventDialog open={viewDialog} setOpen={setViewDialog} id={id}/>
            <CommandDialog open={pallet} onOpenChange={setPallet}>
                <CommandInput placeholder="Начните вводить название события..."/>
                <CommandList>
                    <CommandEmpty>Ничего не найдено</CommandEmpty>
                    <CommandGroup heading="События">
                        {events?.map((item) => (
                            <CommandItem key={item.id} value={item.title} keywords={[item.title]} onSelect={(id) => {
                                setId(item.id.split("&")[0]!);
                                setViewDialog(true);
                                setPallet(false);
                            }} className={cn("mb-1.5", BorderMapper[item.color])}>
                                    <div className="ml-1">
                                        <div className="flex space-x-2 min-w-fit">
                                            <span>{format(item.start, "dd MMM HH:mm")} - {format(item.end, "dd MMM HH:mm")}</span>
                                        </div>
                                        <div>
                                            {item.title}
                                        </div>
                                    </div>
                            </CommandItem>
                        ))}
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
                        <Button size="icon" className="ml-auto" onClick={(_) => setAddDialog(true)}><Plus/></Button>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDate}
                        className="rounded-md border w-f bg-white"
                    />
                    <div className="overflow-y-auto no-scrollbar w-full">
                        {(eventsToday && eventsToday.length > 0) && (
                            <>
                            <hr className="h-[2px] bg-[#BCBCBC] w-full px-[15px] my-4"/>
                                <div className="flex flex-col w-full max-w-full space-y-3">
                                    <div className="self-start">Сегодня {format(today, "dd/MM/yyyy")}</div>
                                    {eventsToday?.map((item) => (
                                        <div className="flex" key={item.id}>
                                            <div
                                                className={cn("h-[24px] w-[24px] shrink-0 rounded-full", ColorMapper[item.color])}/>
                                            <div className="ml-1">
                                                <div className="flex space-x-2 min-w-fit">
                                                    <span>{format(item.start, "dd MMM HH:mm")} - {format(item.end, "dd MMM HH:mm")}</span>
                                                </div>
                                                <div>
                                                    {item.title}
                                                </div>
                                                <div className="text-wrap break-normal text-gray-500">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {(eventsTomorrow && eventsTomorrow.length > 0) && (
                            <>
                                <hr className="h-[2px] bg-[#BCBCBC] w-full px-3 my-8"/>
                                <div className="flex flex-col w-full max-w-full space-y-3">
                                    <div className="self-start">Завтра {format(addDays(today, 1), "dd/MM/yyyy")}</div>
                                    {eventsTomorrow?.map((item) => (
                                        <div className="flex" key={item.id}>
                                            <div
                                                className={cn("h-[24px] w-[24px] shrink-0 rounded-full", ColorMapper[item.color])}/>
                                            <div className="ml-1">
                                                <div className="flex space-x-2 min-w-fit">
                                                    <span>{format(item.start, "dd MMM HH:mm")} - {format(item.end, "dd MMM HH:mm")}</span>
                                                </div>
                                                <div>
                                                    {item.title}
                                                </div>
                                                <div className="text-wrap break-normal text-gray-500">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
                <div className="flex-grow flex flex-col pt-3 max-h-screen   ">
                    <Tabs defaultValue="week" className="flex-grow flex flex-col">
                        <TabsList className=" w-[400px] mx-auto grid grid-cols-3">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                        </TabsList>
                        <TabsContent value="day" className="flex-grow">
                            <FullCalendar
                                plugins={[interactionPlugin, timeGridWeek]}
                                initialView="timeGridDay"
                                views={{
                                    timeGridDay: {
                                        type: "timeGridDay",
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
                                    setId(event.event.id.split("&")[0]!);
                                    setViewDialog(true);
                                }}
                                eventChange={handleEventChange}
                                headerToolbar={false}
                                height="100%"
                                eventResizableFromStart
                                droppable
                                editable
                                nowIndicator
                                selectable
                                eventClassNames={(e) => {
                                    return EventColorMapper[e.backgroundColor as Colors]
                                }}
                            />
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
                                    setId(event.event.id.split("&")[0]!);
                                    setViewDialog(true);
                                }}
                                eventChange={handleEventChange}
                                headerToolbar={false}
                                height="100%"
                                eventResizableFromStart
                                droppable
                                editable
                                nowIndicator
                                selectable
                                eventClassNames={(e) => {
                                    return EventColorMapper[e.backgroundColor as Colors]
                                }}

                            />
                        </TabsContent>
                        <TabsContent value="month" className="flex-grow">
                            <FullCalendar
                                plugins={[interactionPlugin, dayGridMonth]}
                                initialView="dayGridMonth"
                                initialDate={date}
                                events={events}
                                eventClick={(event) => {
                                    setId(event.event.id.split("&")[0]!);
                                    setViewDialog(true);
                                }}
                                eventChange={handleEventChange}
                                headerToolbar={false}
                                height="100%"
                                eventResizableFromStart
                                droppable
                                editable
                                nowIndicator
                                selectable
                                eventClassNames={(e) => {
                                    return EventColorMapper[e.backgroundColor as Colors]
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}
