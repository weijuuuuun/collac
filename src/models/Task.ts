import {User} from "./User";

export interface Task {

    id?: number;
    assigned?: User;
    creator?: User;
    title?: string;
    isDone?: boolean;
    event?: Event;
}
