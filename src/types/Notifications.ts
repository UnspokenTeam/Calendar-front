import Interval from "@/types/Interval";

export interface Notification {
    id: string;
    event_id: string;
    author_id: string;
    enabled: boolean;
    start: Date;
    repeating_delay: Interval;
    delay: Interval;
    created_at: Date;
    deleted_at: Date;
}
