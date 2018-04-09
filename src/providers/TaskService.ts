import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {Event} from "../models/Event";
import {Observable} from "rxjs/Observable";
import {Task} from "../models/Task";
import {HttpClient} from "@angular/common/http";


@Injectable()
export class TaskService {

    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private apollo:Apollo,
                private http: HttpClient) {

    }

    ngOnInit() {

    }
}