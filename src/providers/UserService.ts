import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {Observable} from "rxjs/Observable";
import {Apollo} from "apollo-angular";
import {map} from "rxjs/operators";
import gql from "graphql-tag";
import "rxjs/add/operator/mergeMap";
import {Event} from "../models/Event";
import {Task} from "../models/Task";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class UserService {


    private userEventsSubject: BehaviorSubject<Array<Event>> = new BehaviorSubject([]);
    private userTasksSubject: BehaviorSubject<Array<Task>> = new BehaviorSubject([]);

    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private http: HttpClient, private apollo: Apollo) {

    }


    /**
     * Method to create user against the backend
     * When success, will return the user details from backend.
     */
    public createUser(user: User): Observable<number> {
        return this.http.post<number>(`http://localhost:9001/users`, user);
    }

    public getFriends(userId: number): Observable<User[]> {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    user(id: ${userId}) {
                    friends{
                        id,
                        firstName,
                        lastName
                    },
                  }
                }
            `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.user.friends;
                })
            );
    }

    public getEventsOwned(userId: number): Observable<Event[]> {
        return this.apollo.watchQuery<any>({
            query: gql`
                    query {
                        user(id: ${userId}) {
                        eventsOwned{
                            id,
                            title,
                            due,
                            description
                        }
                      }
                    }
                `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.user.eventsOwned;
                })
            );
    }

    public getEventsJoined(userId: number): Observable<Event[]> {
        return this.apollo.watchQuery<any>({
            query: gql`
                    query {
                        user(id: ${userId}) {
                        eventsJoined{
                            id,
                            title,
                            due,
                            description
                        }
                      }
                    }
                `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.user.eventsJoined;
                })
            );
    }

    public getTasks(userId: number): Observable<Task[]> {
        return this.apollo.watchQuery<any>({
            query: gql`
                    query {
                        user(id: ${userId}) {
                        tasks{
                            id,
                            title
                        }
                      }
                    }
                `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.user.tasks;
                })
            );
    }

    public populateCachedEvents(userId: number): Observable<Event[]> {
        return this.getEventsJoined(userId)
            .flatMap(eventsJoined => {
                return this.getEventsOwned(userId)
                    .map(eventsOwned => {
                        this.userEventsSubject.next(eventsJoined.concat(eventsOwned));
                        return eventsJoined.concat(eventsOwned);
                    })
            })
    }

    public populateCachedTasks(userId: number): Observable<Task[]> {
        return this.getTasks(userId)
            .map(tasks => {
                this.userTasksSubject.next(tasks);
                return tasks;
            })
    }

    public getEventsObservable(): Observable<any> {
        return this.userEventsSubject.asObservable();
    }

    public getTasksObservable(): Observable<any> {
        return this.userTasksSubject.asObservable();
    }

    public clearCachedEvents(): void {
        this.userEventsSubject = new BehaviorSubject([]);
    }

    public clearCachedTasks(): void {
        this.userTasksSubject = new BehaviorSubject([]);
    }

    public updateCachedEvent(newEvents: Event[]) {
        //console.log(newEvents);
        this.userEventsSubject.next(newEvents);
    }
}