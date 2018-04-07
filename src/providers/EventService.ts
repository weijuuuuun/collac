import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {User} from "../models/User";
import {Event} from "../models/Event";
import {Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";


@Injectable()
export class EventService {

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

    public createEvent(event: Event): Observable<Event>{
        return this.http.post<User>(`http://localhost:9001/events`, event);
    }

    public eventAddMember(eventId: number, memberId: number){
        return this.http.post(`http://localhost:9001/events/${eventId}/members`)
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



}