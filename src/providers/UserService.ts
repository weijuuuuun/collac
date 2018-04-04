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
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserService {


    private userEventsSubject: Subject<Event[]> = new Subject<Event[]>();
    public userEvents: Observable<Event[]> = this.userEventsSubject.asObservable();

    private userTasksSubject: Subject<Task[]> = new Subject<Task[]>();
    public userTasks: Observable<Task[]> = this.userTasksSubject.asObservable();

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


  public populateCachedEvents(userId: number): void {
    this.getEventsJoined(userId)
      .subscribe(eventsJoined => {
        return this.getEventsOwned(userId)
          .subscribe(eventsOwned => {
            this.userEventsSubject.next(eventsJoined.concat(eventsOwned));
          })
      });
  }

  public populateCachedTasks(userId: number): void {
    this.getTasks(userId)
      .subscribe(tasks => {
        this.userTasksSubject.next(tasks);
      })
  }


  public clearCachedEvents(): void {
    this.userEvents= new Subject<Event[]>().asObservable();
  }

  public clearCachedTasks(): void {
      this.userTasks = new Subject<Task[]>().asObservable();
  }


}