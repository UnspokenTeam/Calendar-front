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
import {cn, httpClient} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
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
import {useSession} from "next-auth/react";

interface IAddEvent {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const formSchema = z.object({
    start: z.date(),
    end: z.date(),
    title: z.string(),
    description: z.string(),
    color: z.string(),
    interval: z.any()
});


const AddEvent: React.FC<IAddEvent> = ({open, setOpen}) => {
    const session = useSession();
    const client = useQueryClient();

    const {mutateAsync} = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            await httpClient.post(`events/?access_token=${session.data?.user.access_token}`, {...values, repeating_delay: {
                minutes: 0
                }});
            await client.invalidateQueries({
                queryKey: ["events"]
            });
        },
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start: new Date(),
            end: new Date(),
            title: "",
            description: "",
            color: "red",
            interval: {}
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await mutateAsync(values);
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-auto">
                <DialogHeader>
                    <DialogTitle>Создать событие</DialogTitle>
                    <DialogDescription>
                        Не забудьте создать событие!
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
                                        <Textarea {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name="description"/>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Создать</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

AddEvent.displayName = "AddEvent";

export default AddEvent;