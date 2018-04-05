import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";


@Injectable()
export class EventService {

    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private apollo:Apollo) {

    }

    ngOnInit() {

    }

    /**
     * Making a GraphQL Call
     * @returns {Observable<any>}
     */
    public queryEvent(eventID: number) {

        console.log("Querying apollo");

        // Define the data you want here.
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}) {
                    id,
                    title
                  }
                }
            `,
            variables: {
                eventId: 1
            }
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.event;
                })
            );
    }

    public getEventMembers(eventID: number) {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}) {
                    id,
                    title,
                    members{
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
                    return result.data.event.members;
                })
            );
    }

    public getEventOwner(eventID: number) {
        console.log("calling get owner")
        console.log(eventID)
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${eventID}){
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



}