"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn, getDefaultNotificationOption, getDefaultRepeatingOption, getNotification} from "@/lib/utils";
import {CalendarIcon, RotateCw} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimePickerDemo} from "@/components/ui/time-picker-demo";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {GradientPicker} from "@/components/gradient-picker";
import {Colors, Event, EventDescription} from "@/types/Events";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";

interface IAddEvent {
    open: boolean;
    setOpen: (open: boolean) => void;
    event: Event;
}

const formSchema = z.object({
    start: z.date(),
    end: z.date(),
    title: z.string(),
    description: z.string(),
    color: Colors,
    repeating_delay: z.object({
        years: z.number().min(0).optional(),
        months: z.number().min(0).optional(),
        weeks: z.number().min(0).optional(),
        days: z.number().min(0).optional(),
    }).optional(),
    notification: z.object({
        enabled: z.boolean().default(false).optional(),
        before_start: z.number().min(1).default(1),
        unit: z.enum(['minutes', 'hours', 'days'])
    })
});


const EditEvent: React.FC<IAddEvent> = ({open, setOpen, event}) => {
    const client = useQueryClient();

    const {mutateAsync} = useMutation({
        mutationFn: async (values: Omit<z.infer<typeof formSchema>, "notification">) => {
            values.start.setSeconds(0);
            values.end.setSeconds(0);
            const res = await apiClient.put<Event>("events/", {
                ...event.event,
                ...values
            });
            await client.invalidateQueries({
                queryKey: ["events"]
            });

            return res.data;
        },
    })

    const [gpt, setGpt] = React.useState<boolean>(false);

    const generateTitle = async (onChange: (event: unknown) => unknown) => {
        setGpt(true);
        try {
            const res = (await apiClient.get<EventDescription>("events/description/", {
                params: {
                    event_title: title
                }
            })).data
            onChange(res);
            setGpt(false);
        } catch {
            toast.error("Что-то пошло не так")
            setGpt(false);
        }
    }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: new Date(),
            end: new Date(),
            title: "",
            description: "",
            color: "red",
            repeating_delay: {},
            notification: {}
        },
        values: {
            start: new Date(event.event.start),
            end: new Date(event.event.end),
            title: event.event.title,
            description: event.event.description ?? "",
            color: event.event.color,
            repeating_delay: event.event.repeating_delay ?? {},
            notification: getNotification(event.notification)
        }
    });

    const title = form.watch("title");

    const notification = form.watch("notification.enabled", false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const notification = {
            minutes: 0,
            hours: 0,
            days: 0,
        };

        if (values.notification.enabled) {
            switch (values.notification.unit) {
                case "minutes":
                    notification.minutes = values.notification.before_start;
                    break
                case "hours":
                    notification.hours = values.notification.before_start;
                    break
                case "days":
                    notification.days = values.notification.before_start;
                    break
            }
        }

        await mutateAsync({
            start: values.start,
            end: values.end,
            title: values.title,
            description: values.description,
            color: values.color,
            repeating_delay: values.repeating_delay,
        });

        if (values.notification.enabled) {
            const notification = {
                minutes: 0,
            };

            notification.minutes = values.notification.before_start;
            switch (values.notification.unit) {
                case "hours":
                    notification.minutes *= 60;
                    break
                case "days":
                    notification.minutes *= 1440;
                    break
            }

            if (event.notification) {
                await apiClient.put("notifications/", {
                    ...event.notification,
                    delay: {
                        ...notification
                    }
                })
            } else {
                await apiClient.post("notifications/", {
                    ...notification
                }, {
                    params: {
                        event_id: event.event.id
                    }
                })
            }


        } else if (event.notification) {
            await apiClient.delete("notifications/", {
                params: {
                    notification_id: event.notification.id
                }
            })
        }

        await client.invalidateQueries({
            queryKey: ["notifications"]
        })

        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-auto">
                <DialogHeader>
                    <DialogTitle>Изменение события</DialogTitle>
                    <DialogDescription>
                        Не забудьте сохранить изменения!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
                        <div className="grid grid-cols-2 gap-1 py-4">
                            <FormField control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormDescription><Label>Начало события</Label></FormDescription>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-[225px] justify-start text-left font-normal",
                                                        field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {field.value ? (
                                                        format(field.value, "PPP HH:mm:ss")
                                                    ) : (
                                                        <span>Выберите начало</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePickerDemo
                                                        setDate={field.onChange}
                                                        date={field.value}
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="start"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormDescription><Label>Конец события</Label></FormDescription>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-[225px] justify-start text-left font-normal",
                                                        field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {field.value ? (
                                                        format(field.value, "PPP HH:mm:ss")
                                                    ) : (
                                                        <span>Выберите конец</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePickerDemo
                                                        setDate={field.onChange}
                                                        date={field.value}
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="end"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormDescription><Label>Название события</Label></FormDescription>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="title"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormDescription><Label>Описание события</Label></FormDescription>
                                    <FormControl>
                                        <div className="relative">
                                            {gpt ? <Skeleton className="w-full min-h-[80px]"/> : (
                                                <Textarea {...field}/>
                                            )}
                                            <Button variant="outline"
                                                    className="absolute right-0 bottom-0" type="button"
                                                    title="Сгенерировать описание"
                                                    onClick={() => generateTitle(field.onChange)}
                                                    disabled={gpt}><RotateCw/></Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="description"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem className="col-span-1">
                                    <FormDescription><Label>Цвет</Label></FormDescription>
                                    <FormControl>
                                        <GradientPicker {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="color"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem className="col-span-1">
                                    <FormDescription><Label>Повтор</Label></FormDescription>
                                    <Select
                                        defaultValue={getDefaultRepeatingOption(field.value)}
                                        onValueChange={(value) => {
                                            switch (value) {
                                                case 'day':
                                                    field.onChange({days: 1});
                                                    break;
                                                case 'week':
                                                    field.onChange({weeks: 1});
                                                    break;
                                                case 'month':
                                                    field.onChange({months: 1});
                                                    break;
                                                case 'year':
                                                    field.onChange({years: 1});
                                                    break;
                                                case 'nothing':
                                                default:
                                                    field.onChange({});
                                                    break;
                                            }
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите интервал повторения"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="nothing">Не повторять</SelectItem>
                                            <SelectItem value="day">Ежедневно</SelectItem>
                                            <SelectItem value="week">Еженедельно</SelectItem>
                                            <SelectItem value="month">Ежемесячно</SelectItem>
                                            <SelectItem value="year">Ежегодно</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )} name="repeating_delay"/>
                            <FormField control={form.control} render={({field}) => (
                                <FormItem className="col-span-2">
                                    <FormDescription><Label>Уведомление</Label></FormDescription>
                                    <Select onValueChange={field.onChange} disabled={!notification}
                                            defaultValue={getDefaultNotificationOption(event.notification?.delay ?? {})}>
                                        <FormControl>
                                            <div className="flex flex-row space-x-1.5">
                                                <FormField render={({field: fieldn}) => (
                                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                                    <Checkbox checked={fieldn.value} onCheckedChange={fieldn.onChange}
                                                              className="self-center" value="true"><Label>Включить
                                                        уведомление</Label></Checkbox>
                                                )} name="notification.enabled"/>
                                                <Input {...form.register('notification.before_start', {valueAsNumber: true})}
                                                       type="number" disabled={!notification} min={1}/>
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </div>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="minutes">мин.</SelectItem>
                                            <SelectItem value="hours">час.</SelectItem>
                                            <SelectItem value="days">дн.</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )} name="notification.unit"/>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Сохранить</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

EditEvent.displayName = "EditEvent";

export default EditEvent;