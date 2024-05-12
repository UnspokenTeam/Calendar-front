import {User} from "@/types/Users";
import {z} from "zod";
import Interval from "@/types/Interval";
import {Notification} from "@/types/Notifications";

export const Colors = z.enum([
    'red',
    'green',
    'yellow',
    'blue',
    'teal',
    'pink',
    'orange',
    'fuchsia',
    'purple',
    'lightBlue',
]);

export const ColorMapper = {
    "red": "bg-red-500",
    "blue": "bg-blue-500",
    "green": "bg-green-500",
    "yellow": "bg-yellow-500",
    "orange": "bg-orange-500",
    "purple": "bg-purple-500",
    "pink": "bg-pink-500",
    "teal": "bg-teal-500",
    "fuchsia": "bg-fuchsia-500",
    "lightBlue": "bg-blue-200"
};

export const EventColorMapper = {
    "red": "!bg-red-100/50 !border-l-4 !border-r-0 !border-y-0 !border-red-500 !text-red-500",
    "blue": "!bg-blue-100/50 !border-l-4 !border-r-0 !border-y-0 !border-blue-500 !text-blue-500",
    "green": "!bg-green-100/50 !border-l-4 !border-r-0 !border-y-0 !border-green-500 !text-green-500",
    "yellow": "!bg-yellow-100/50 !border-l-4 !border-r-0 !border-y-0 !border-yellow-500 !text-yellow-500",
    "orange": "!bg-orange-100/50 !border-l-4 !border-r-0 !border-y-0 !border-orange-500 !text-orange-500",
    "purple": "!bg-purple-100/50 !border-l-4 !border-r-0 !border-y-0 !border-purple-500 !text-purple-500",
    "pink": "!bg-pink-100/50 !border-l-4 !border-r-0 !border-y-0 !border-pink-500 !text-pink-500",
    "teal": "!bg-teal-100/50 !border-l-4 !border-r-0 !border-y-0 !border-teal-500 !text-teal-500",
    "fuchsia": "!bg-fuchsia-100/50 !border-l-4 !border-r-0 !border-y-0 !border-fuchsia-500 !text-fuchsia-500",
    "lightBlue": "!bg-blue-200/50 !border-l-4 !border-r-0 !border-y-0 !border-blue-200 !text-blue-200"
}

export type Colors = z.infer<typeof Colors>;

export interface EventItem {
    id: string,
    title: string,
    start: Date,
    end: Date,
    author_id: string,
    created_at: Date,
    description: string,
    color: Colors,
    repeating_delay?: Interval
    deleted_at: Date
}

export type Events = EventItem[];

export interface Event {
    event: EventItem,
    invited_users: User[],
    notification: Notification
}