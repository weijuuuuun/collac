import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";


@Injectable()
export class TaskService {

    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private apollo:Apollo) {

    }

    ngOnInit() {

    }

    public getEventTask() {
        return this.apollo.watchQuery<any>({
            query: gql`
                query {
                    tasks {
                        id,
                        title
                        event{
                            id,
                            title,
                        },
                        assigned{
                            firstName
                        }
                    }
                }
            `
        })
            .valueChanges
            .pipe(
                map(result => {
                    return result.data.tasks;
                })
            );
    }

}