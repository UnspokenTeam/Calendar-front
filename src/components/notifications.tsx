import {useQuery, useQueryClient} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {Notification} from "@/types/Notifications";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {getNotification} from "@/lib/utils";

const Notifications: React.FC = () => {
    const client = useQueryClient();
    const [notifications, setNotifications]
        = useState<Map<string, boolean>>(new Map<string, boolean>);
    const {data} = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            return (await apiClient.get<Notification[]>("notifications/my/", {
                params: {
                    page: 1,
                    items_per_page: -1,
                }
            })).data;
        }
    })

    useEffect(() => {
        const currentTime = new Date();
        if (data) {
            for (const nf of data) {
                if (nf.id in notifications) {
                    continue;
                }

                if (currentTime > nf.start && nf.enabled) {
                    const context = async () => {
                        const event =  await client.fetchQuery({
                            queryKey: ["event", nf.event_id]
                        })

                        const parsed = getNotification(nf);

                        toast.warning(`Событие начнется через ${parsed.before_start} ${parsed.unit}!`)
                    }

                    void context()
                }
            }
        }
    }, [data])


    return <></>
}

export default Notifications;