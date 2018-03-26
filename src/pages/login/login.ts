import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/AuthenticationService";
import {User} from "../../models/User";
import {EventService} from "../../providers/EventService";
import {Storage} from "@ionic/storage";
import {any} from "async";

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
              private storage: Storage) {
  }

  // ngOnInit() {
  //     this.testGraphQLQuery();
  // }

  navigateToPage(pageName:string){
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

  setUserName(){
      this.storage.set('username',this.username)
          .then(
              () => console.log('Stored User: ' + this.username)
          );
  }

  setUserID(userID){
      this.storage.set('userID', userID)
          .then(
              () => console.log('Stored item: ' + userID),
              error => console.error('Error Storing',error)
          );
  }
  getData(){
      this.storage.get('userID')
          .then((data)=>{
          console.log('get UserID: ' + data);
      });
  }

  presentToast(name){
    this.toast.create({
        message: "Welcome back, " + name,
        duration: 3000
    }).present();
  }

  presentErrorToast(err){
      this.toast.create({
          message: err,
          duration: 3000
      }).present();
  }


  doLogin(){
    this.testGraphQLQuery();
    this.authenticationService.authenticate(this.username, this.password)
    .subscribe(response => {
      /**
       * Successful login will save userid in local storage to pull data
       * in database (events,contacts,groups)
      */
      console.log("success");
      this.setUserID(response.id);
      this.setUserName();
      this.presentToast(response.firstName);
      this.getData();

      // Navigate to HomePage
      this.navCtrl.setRoot('HomePage');
      console.log(response);


    }, err => {
      /** return error */
      console.log("error occurred");
      this.presentErrorToast(err.error.message);
      console.log(err);
      console.log(err.error.message); // error message.

      // if err.error.message.contains("no id found or sth") then u know, no id found, display error message to user


    });

  }

}
