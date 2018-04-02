import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/AuthenticationService";
import {EventService} from "../../providers/EventService";
import {Storage} from "@ionic/storage";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;

  constructor(private navCtrl: NavController,
              private toast: ToastController,
              private authenticationService: AuthenticationService,
              private eventService: EventService,
              private storage: Storage,
              private localStorageHelper: LocalStorageHelper) {
  }

  ionViewWillEnter() {
    this.storage.ready()
      .then(() => {
        this.localStorageHelper.getLoggedInUser()
          .then(user => {
            if(user) {
              this.navCtrl.setRoot('HomePage');
            }
          });
      });
  }

  navigateToPage(pageName: string) {
    this.navCtrl.push(pageName);
  }

  /**
   * Example of calling query with graphql server.
   */
  testGraphQLQuery() {
    console.log("test graphql queury called");
    this.eventService.queryEvent(1)
      .subscribe(data => {
        console.log("success getting graphql data");
        console.log(data);
      }, err => {
        console.log("error getting graphql data");
        console.log(err);
      })
  }

  setUserName() {
    this.storage.set('username', this.username)
      .then(
        () => console.log('Stored User: ' + this.username)
      );
  }

  setUserID(userID) {
    this.storage.set('userID', userID)
      .then(
        () => console.log('Stored item: ' + userID),
        error => console.error('Error Storing', error)
      );
  }

  getData() {
    this.storage.get('userID')
      .then((data) => {
        console.log('get UserID: ' + data);
      });
  }

  presentSuccessToast(name) {
    this.toast.create({
      message: "Welcome back, " + name,
      duration: 3000
    }).present();
  }

  presentErrorToast(err) {
    this.toast.create({
      message: err,
      duration: 3000
    }).present();
  }


  doLogin() {
    this.authenticationService.authenticate(this.username, this.password)
      .subscribe(loggedInUser => {
        this.localStorageHelper.setLoggedInUser(loggedInUser)
          .then(() => {
            console.log("Login.ts: Successfully store logged in user details");
            this.presentSuccessToast(loggedInUser.firstName);
            this.navCtrl.setRoot('HomePage');
          });

      }, err => {
        /** return error */
        console.log("Login.ts: Error logging in");
        this.presentErrorToast(err.error.message);
        console.log(err);
        console.log(err.error.message); // error message.

        // if err.error.message.contains("no id found or sth") then u know, no id found, display error message to user


      });

  }

}
