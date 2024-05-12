"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import React from "react";
import {Textarea} from "@/components/ui/textarea";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {Event} from "@/types/Events";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import apiClient from "@/lib/api-client";
import EditEvent from "@/components/edit-event-dialog";
import {Input} from "@/components/ui/input";
import {GradientPicker} from "@/components/gradient-picker";
import {Skeleton} from "@/components/ui/skeleton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getDefaultNotificationOption, getDefaultRepeatingOption, getNotificationDelay} from "@/lib/utils";
import {Checkbox} from "@/components/ui/checkbox";

interface IViewEvent {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: string;
}


const ViewEvent: React.FC<IViewEvent> = ({open, setOpen, id}) => {
    const session = useSession();
    const client = useQueryClient();
    const [deleteDialog, setDeleteDialog] = React.useState<boolean>(false);
    const [edit, setEdit] = React.useState<boolean>(false);


    const {data, isLoading} = useQuery({
        queryKey: ["events", id],
        queryFn: async (args) => {
            const [_, id] = args.queryKey;
            return (await apiClient.get<Event>(`events/${id}`)).data
        },
        retry: 3,
        enabled: open
    })

    const {mutate} = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete("events/", {
                params: {
                    event_id: id
                }
            })

            await client.invalidateQueries({
                queryKey: ["events"]
            });
        },
    })

    const handleDelete = () => {
        setDeleteDialog(false);
        setOpen(false);
        if (data) {
            mutate(data.event.id);
        }
    }

    return (
        <>
            <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя отменить. Это приведет к окончательному удалению
                            события &quot;{data?.event.title}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Продолжить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-auto">
                    <DialogHeader>
                        <DialogTitle>Просмотр события</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-1 py-4">
                        <div className="col-span-2">
                            <Label>Название</Label>
                            <Input value={data?.event.title} disabled/>
                        </div>
                        <div className="col-span-2 text-muted-foreground">
                            <div className="flex flex-row  min-w-[350px] w-auto justify-between">
                                <div>{format(data?.event.start ?? new Date(), "PPP HH:mm")}</div>
                                <div>{format(data?.event.end ?? new Date(), "PPP HH:mm")}</div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <Label>Описание</Label>
                            <Textarea value={data?.event.description} disabled></Textarea>
                        </div>
                        <div>
                            <Label>Цвет</Label>
                            {isLoading ? <Skeleton className="h-10"/> : (
                                <GradientPicker value={data?.event.color ?? "red"} disabled/>
                            )
                            }
                        </div>
                        <div>
                            <Label>Повтор</Label>
                            {isLoading ? <Skeleton className="h-10"/> : (
                                <Select
                                    defaultValue={getDefaultRepeatingOption(data?.event.repeating_delay)} disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите интервал повторения"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nothing">Не повторять</SelectItem>
                                        <SelectItem value="day">Ежедневно</SelectItem>
                                        <SelectItem value="week">Еженедельно</SelectItem>
                                        <SelectItem value="month">Ежемесячно</SelectItem>
                                        <SelectItem value="year">Ежегодно</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                        </div>
                        <div className="col-span-2">
                            <Label>Уведомление</Label>
                            {isLoading ? <Skeleton className="h-10"/> : (<div className="flex flex-row">
                                {getDefaultNotificationOption(data?.notification?.delay) === "nothing" ? "Выключено" : (
                                    <>
                                        <Checkbox
                                            className="self-center"
                                            checked={getDefaultNotificationOption(data?.notification.delay) !== "nothing"}
                                            disabled/>
                                        <Input disabled
                                               value={getNotificationDelay(data?.notification.delay.minutes ?? 0)}/>
                                        <Select disabled
                                                defaultValue={getDefaultNotificationOption(data?.notification.delay)}>
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minutes">мин.</SelectItem>
                                                <SelectItem value="hours">час.</SelectItem>
                                                <SelectItem value="days">дн.</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}

                            </div>)}

                        </div>
                    </div>

                    <DialogFooter className="!justify-center !space-x-5">
                        <Button variant="outline" className="px-4 bg-[#E1EAFF]"
                                onClick={() => setEdit(true)}>Изменить</Button>
                        <Button variant="default" className="px-6"
                                onClick={() => setDeleteDialog(true)}>Удалить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {
                data && <EditEvent open={edit} setOpen={setEdit} event={data}/>
            }
        </>
    )
}

ViewEvent.displayName = "ViewEvent";

export default ViewEvent;