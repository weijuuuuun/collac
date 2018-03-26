import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {User} from "../../models/User";
import {UserService} from "../../providers/UserService";
import {Credential} from "../../models/Credential";



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(private navCtrl: NavController,
              private userService: UserService,
              private toast: ToastController) {
  }

  popPage(){
      this.navCtrl.pop();
  }

  presentErrorToast(){
      this.toast.create({
          message: "Input valid name or email",
          duration: 3000
      }).present();
  }

  validate(){
      if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)){
          if(/^[a-zA-Z0-9]+$/.test(this.firstName) && /^[a-zA-Z0-9]+$/.test(this.lastName)){
            return true;
          }
      }
      this.presentErrorToast();
      return false
  }

  onRegister() {
      // call this method on clicking submit button
      // validate form value
      if(this.validate()){
          let firstName = this.firstName;
          let lastName = this.lastName;
          let email = this.email;
          let password = this.password;

          let credential: Credential = {
              email,
              password
          }

          // create user object
          let newUser: User = {
              firstName,
              lastName,
              email,
              credential
          }
          this.userService.createUser(newUser)
          this.popPage();
      }
  }
}
