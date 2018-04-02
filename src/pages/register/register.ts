import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {User} from "../../models/User";
import {UserService} from "../../providers/UserService";
import {Credential} from "../../models/Credential";
import {LoginPage} from "../login/login";



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  newUser: User = {
    firstName: "",
    lastName: "",
    email: "",
    credential: {
      password: ""
    }
  };


  constructor(private navCtrl: NavController,
              private userService: UserService,
              private toast: ToastController) {
  }


  presentErrorToast(){
      this.toast.create({
          message: "Input valid name or email",
          duration: 3000
      }).present();
  }

  presentSuccessToast() {
    this.toast.create({
      message: "Registration success.",
      duration: 3000
    }).present();
  }

  validate(){
      if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.newUser.email)){
          if(/^[a-zA-Z0-9]+$/.test(this.newUser.firstName) && /^[a-zA-Z0-9]+$/.test(this.newUser.lastName)){
            return true;
          }
      }
      this.presentErrorToast();
      return false
  }

  onRegister() {

    if(!this.validate()) {
      return;
    }

    this.userService.createUser(this.newUser)
      .subscribe(newUserId => {
        console.log("register.ts: Success user registration. ID: " + newUserId);
        this.presentSuccessToast();
        this.navCtrl.setRoot(LoginPage);
      },
      err => {
        console.log("register.ts: Failed user registration. ");
        console.log(err.error.code + ": " + err.error.message);
      })
  }
}
