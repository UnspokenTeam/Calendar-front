import {User} from "@/types/Users";

export interface EventItem {
    id: string,
    title: string,
    start: Date,
    end: Date,
    author_id: string,
    created_at: Date,
    description: string,
    color: string,
    repeating_delay: {
        "years": 0,
        "months": 0,
        "weeks": 0,
        "days": 0,
        "hours": 0,
        "minutes": 0,
        "seconds": 0
    },
    deleted_at: Date
}

export type Events = EventItem[];

export interface Event {
    event: EventItem,
    invited_users: User[],
    notification_turned_on: boolean
}