import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import Interval from "@/types/Interval";
import {Notification} from "@/types/Notifications";
import {z} from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getDefaultRepeatingOption(delay?: Interval): "day" | "week" | "month" | "year" | "nothing" {
    if (delay?.days === 1) return "day";
    if (delay?.weeks === 1) return "week";
    if (delay?.months === 1) return "month";
    if (delay?.years === 1) return "year";

    return "nothing";
}

const notificationSchema = z.object({
    enabled: z.boolean().default(false).optional(),
    before_start: z.number().min(1).default(1),
    unit: z.enum(['minutes', 'hours', 'days'])
});

export function getNotification(notification: Notification | null): z.infer<typeof notificationSchema> {
    // Проверка на null или undefined
    if (!notification || !notification.enabled) {
        return {
            enabled: false,
            before_start: 1, // Значение по умолчанию
            unit: 'minutes'  // Единица измерения по умолчанию
        };
    }

    // Определение unit и before_start на основе доступной информации
    let beforeStart = 1; // Значение по умолчанию
    let unit: 'minutes' | 'hours' | 'days' = 'minutes'; // Единица измерения по умолчанию

    if (notification.delay?.minutes) {
        if (notification.delay?.minutes % 1440 === 0) {
            beforeStart = Math.floor(notification.delay.minutes / 1440);
            unit = 'days';
        } else if (notification.delay?.minutes % 60 === 0) {
            beforeStart = Math.floor(notification.delay.minutes / 60);
            unit = 'hours';
        } else {
            beforeStart = notification.delay.minutes;
            unit = 'minutes';
        }
    }

    return {
        enabled: notification.enabled,
        before_start: beforeStart,
        unit: unit
    };
}

export function getDefaultNotificationOption(delay?: Interval): "minutes" | "hours" | "days" | "nothing" {
    if (delay?.minutes) {
        if (delay.minutes % 1440 === 0) {
            return "days"
        } else if (delay.minutes % 60 === 0) {
            return "hours"
        } else {
            return "minutes"
        }
    }


    return "nothing";
}

export function getNotificationDelay(value: number): number {
    if (value % 1440 === 0) {
        return Math.floor(value / 1440);
    } else if (value % 60 === 0) {
        return Math.floor(value / 60);
    }

    return value;
}