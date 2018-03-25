import {Credential} from "./Credential";
import {Event} from "./Event";

export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    pushToken?: string;
    credential?: Credential;
    eventsOwned?: Array<Event>;
    eventsJoined?: Array<Event>;
    friends?: Array<User>;
}