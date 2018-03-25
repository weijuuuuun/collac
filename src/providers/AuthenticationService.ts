import {Injectable} from "@angular/core";
import {User} from "../models/User";
import {Credential} from "../models/Credential";
import {backendUrl} from "../Configurations";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthenticationService {

    /**
     * All codes calling  external backend, should be in Service class
     * Your component / page will then call these methods to retrieve data.
     */
    constructor(private http:HttpClient) {

    }

    /**
     * Method to authenticate user against the backend
     * When success, will return the user details from backend.
     */
    public authenticate(email:string, password:string) {

        let credential: Credential = {
            email,
            password
        };

        return this.http.post(`${backendUrl}/authenticate`, credential);
    }



}