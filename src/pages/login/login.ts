import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthenticationService} from "../../providers/AuthenticationService";
import {User} from "../../models/User";

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
              private authenticationService: AuthenticationService) {
  }

  // navigateToPage(pageName:string){
  //   this.navCtrl.push(pageName);
  // }

  getUsername(){

  }

  presentToast(){
    this.toast.create({
        message: "Welcome back, " + this.username,
        duration: 3000
    }).present();
  }

  doLogin(){
    this.authenticationService.authenticate(this.username, this.password)
        .subscribe(response => {
          console.log("success");
          console.log(response);
          // Success, so you will get user data back. save them in local storage
          // Then you can navigate user to home page after this. 

        }, err => {
          console.log("error occured");
          // You can console.log(err) to see the entire error object, and get what you need
          console.log(err);
          console.log(err.error.message); // This is the error message. do sth about it

          // if err.error.message.contains("no id found or sth") then u know, no id found, display error message to user


        });



    // this.navCtrl.setRoot('HomePage');
  }

}
