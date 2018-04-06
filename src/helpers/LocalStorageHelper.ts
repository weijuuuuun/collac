import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {User} from "../models/User";
import {Event} from "../models/Event";


@Injectable()
export class LocalStorageHelper {

  constructor(private storage:Storage ) {

  }

  public setLoggedInUser(user: User): Promise<any> {
    return this.storage.set('loggedInUser', user);
  }

  public getLoggedInUser(): Promise<User> {
    return this.storage.ready()
      .then(() => {
        return this.storage.get('loggedInUser')
          .then(loggedInUser => {
            if(loggedInUser === null) {
              console.log("LocalStorageHelper: loggedInUser is null in Local Storage");
              return null;
            }
            return loggedInUser;
          });
      })
  }
  // public setUserEvents(event: Event): Promise<any> {
  //     return this.storage.set('UserEvents', event);
  // }
  // public getUserEvents

  public clearLocalStorage(): Promise<any> {
    return this.storage.clear();
  }

  public setUserEvents(events: Event[]) {
      return this.storage.set('userEvents', events);
  }


    public getUserEvents(): Promise<Event[]> {
        return this.storage.ready()
            .then(() => {
                return this.storage.get('userEvents')
                    .then(userEvents => {
                        if( userEvents === null) {
                            console.log("LocalStorageHelper: userEvents is null in Local Storage");
                            return null;
                        }
                        return userEvents;
                    });
            })
    }

}