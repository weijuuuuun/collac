import {User} from "./User";
import {Task} from "./Task";

export interface Event {

    id?: number;
    title?: string;
    description?: string;
    members?: Array<User>;
    owner?:  User;
    task?: Array<Task>;
    due?: string;
    socketIoRoom?: string;
}