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
import {Button} from "@/components/ui/button";
import {cn, httpClient} from "@/lib/utils";
import {CalendarIcon, Pencil, PencilIcon, Trash2} from "lucide-react";
import {format} from "date-fns";
import React from "react";
import {Textarea} from "@/components/ui/textarea";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import {Event} from "@/types/Events";
import {Input} from "@/components/ui/input";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface IViewEvent {
    open: boolean;
    setOpen: (open: boolean) => void;
    id?: string;
    setEdit: (open: boolean) => void;
}


const ViewEvent: React.FC<IViewEvent> = ({open, setOpen, id, setEdit}) => {
    const session = useSession();
    const client = useQueryClient();
    const [deleteDialog, setDeleteDialog] = React.useState<boolean>(false)

    const {data} = useQuery({
        queryKey: ["events", id],
        queryFn: async (args) => {
            const [_, id] = args.queryKey;
            return (await httpClient.get<Event>(`events/${id}`, {
                params: {
                    access_token: session.data?.user.access_token,
                }
            })).data
        },
        retry: 3,
        enabled: open
    })

    const {mutate} = useMutation({
        mutationFn: async (id: string) => {
            await httpClient.delete("events/", {
                params: {
                    access_token: session.data?.user.access_token,
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
                            Это действие нельзя отменить. Это приведет к окончательному удалению события &quot;{data?.event.title}&quot;.
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
                            <div className="flex flex-row  min-w-[350px] w-auto">
                                {format(data?.event.start ?? new Date(), "PPP HH:mm")}
                                <div className="w-[10%]">

                                </div>
                                {format(data?.event.end ?? new Date(), "PPP HH:mm")}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <Label>Описание</Label>
                            <Textarea value={data?.event.description} disabled></Textarea>
                        </div>
                    </div>
                    <DialogFooter className="!justify-center !space-x-5">
                        <Button variant="outline" className="px-4 bg-[#E1EAFF]" onClick={() => setEdit(true)}>Изменить</Button>
                        <Button variant="default" className="px-6" onClick={() => setDeleteDialog(true)}>Удалить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    )
}

ViewEvent.displayName = "ViewEvent";

export default ViewEvent;