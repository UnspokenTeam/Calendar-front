import {useQuery, useQueryClient} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {Notification} from "@/types/Notifications";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {getNotification} from "@/lib/utils";
import {Event} from "@/types/Events";
import React from "react";

const Notifications = React.forwardRef<HTMLDivElement>((props, ref) => {
    const client = useQueryClient();
    const [notifications, setNotifications] = useState(new Map<string, boolean>);
    const {data, isFetched} = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            return (await apiClient.get<Notification[]>("notifications/my/", {
                params: {
                    page: 1,
                    items_per_page: -1,
                }
            })).data;
        },
        refetchInterval: (values) => {
            // const currentTime = new Date();
            // if (values.state.data) {
            //     for (const nf of values.state.data) {
            //         if (notifications.get(nf.id)) {
            //             continue;
            //         }
            //
            //         console.log(currentTime > new Date(nf.start), currentTime > nf.start)
            //         if (currentTime > new Date(nf.start) && nf.enabled) {
            //             const context = async () => {
            //                 const event = (await apiClient.get<Event>(`events/${nf.event_id}`)).data
            //
            //                 const parsed = getNotification(nf);
            //
            //                 setNotifications((prev) => prev.set(nf.id, true))
            //                 toast.warning(`Событие ${event.event.title} скоро начнется!`)
            //             }
            //
            //             void context()
            //         }
            //     }
            // }

            return 30000;
        },
    })

    useEffect(() => {
        const currentTime = new Date();
        if (data) {
            for (const nf of data) {
                if (notifications.get(nf.id)) {
                    continue;
                }

                console.log(currentTime > new Date(nf.start), currentTime > nf.start)
                if (currentTime > new Date(nf.start) && nf.enabled) {
                    const context = async () => {
                        const event = (await apiClient.get<Event>(`events/${nf.event_id}`)).data

                        setNotifications((prev) => prev.set(nf.id, true))
                        toast.warning(`Событие ${event.event.title} скоро начнется!`)
                    }

                    void context()
                }
            }
        }
    }, [data, notifications])


    return <div className="hidden" ref={ref}></div>
})

Notifications.displayName = "Notifications"

export default Notifications;