import {User} from "./User";

export interface Task {

    assigned?: User;
    creator?: User;
    title?: string;
    isDone?: boolean;
    event?: Event;
}
