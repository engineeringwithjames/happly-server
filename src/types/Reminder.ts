import {UniqueId} from "../generators";
import {User} from "./User";
import {Habit} from "./Habit";


export type Reminder = {
    id: UniqueId<'reminder'>;
    reminderHour: number; // this should be in UTC
    reminderMinute: number; // this should be in UTC
    userId: User['id'];
    habitId: Habit['id'];
    isDaily: boolean;
    daysOfWeek: string[];
};
