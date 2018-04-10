import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {User} from "../models/User";
import {Event} from "../models/Event";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Task} from "../models/Task";
import {BehaviorSubject} from "rxjs/BehaviorSubject";


@Injectable()
export class EventService {

    private eventTaskSubject: BehaviorSubject<Array<Task>> = new BehaviorSubject([]);


    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private apollo:Apollo, private http: HttpClient) {

    }

    ngOnInit() {

    }

    /**
     * Making a GraphQL Call
     * @returns {Observable<any>}
     */
    // public queryEvent(eventID: number) {
    //
    //     console.log("Querying apollo");
    //
    //     // Define the data you want here.
    //     return this.apollo.watchQuery<any>({
    //         query: gql`
    //             query {
    //                 event(id: ${eventID}) {
    //                 id,
    //                 title
    //               }
    //             }
    //         `,
    //         variables: {
    //             eventId: 1
    //         }
    //     })
    //         .valueChanges
    //         .pipe(
    //             map(result => {
    //                 return result.data.event;
    //             })
    //         );
    // }

    public createEvent(event: Event): Observable<number>{
        return this.http.post<number>(`http://localhost:9001/events`, event);
    }

    public getEventMember(eventID: number) {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}) {
                    id,
                    title,
                    members{
                        id,
                        firstName,
                        lastName,
                        email
                    }
                  }
                }
            `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.event.members;
                })
            );
    }

    public getEventOwner(eventID: number) {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}){
                    id
                        owner {
                            id,
                            firstName,
                            lastName
                        }
                    }
                }
            `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.event.owner;
                })
            );
    }

    public getEventTask(eventID: number) {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}){
                    id
                        tasks {
                            id,
                            title,
                            assigned {
                                id,
                                firstName
                            }
                        }
                    }
                }
            `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.event.tasks;
                })
            );
    }

    public createTask(task: Task,eventId: number): Observable<number>{
        return this.http.post<any>(`http://localhost:9001/events/${eventId}/tasks`, task);
    }

    public populateEventTasks(eventId: number){
        return this.getEventTask(eventId)
            .map(tasks =>{
                this.eventTaskSubject.next(tasks);
                return tasks;
            })
    }



    public updateEventTasks(newTask: Task[]) {
        //console.log(newEvents);
        this.eventTaskSubject.next(newTask);
    }

    public setAssigned(taskId: number, userId: number){
        let assigned: any = {
            assigned: userId
        }
        return this.http.post<any>(`http://localhost:9001/tasks/${taskId}/assigned`, assigned);
    }

    public eventAddMember(eventId: number, newMembers: any){
        let addMembers: any = {
            newMembers: newMembers
        }
        return this.http.post<any>(`http://localhost:9001/events/${eventId}/members`,addMembers)
    }

}