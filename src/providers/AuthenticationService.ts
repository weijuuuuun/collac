import {Injectable} from "@angular/core";
import {Credential} from "../models/Credential";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {backendUrl} from "../Configurations";
import {User} from "../models/User";

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

        console.log("Called " + backendUrl);

        return this.http.post<User>(`http://localhost:9001/authenticate`, credential);
    }






}