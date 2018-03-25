import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {Query} from "../models/GraphQLQuery";

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
    public queryEvent() {

        console.log("Querying apollo");

        // Define the data you want here.
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    event(id: ${1}) {
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


}