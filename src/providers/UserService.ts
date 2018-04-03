import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {backendUrl} from "../Configurations";
import {User} from "../models/User";
import {Observable} from "rxjs/Observable";
import {Apollo} from "apollo-angular";
import {map} from "rxjs/operators";
import gql from "graphql-tag";

@Injectable()
export class UserService {


    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private http:HttpClient, private apollo:Apollo) {

    }

    /**
     * Method to create user against the backend
     * When success, will return the user details from backend.
     */
    public createUser(user: User): Observable<number> {
        return this.http.post<number>(`http://localhost:9001/users`, user);
    }

    public getFriends(userId: number): Observable<User> {
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

}