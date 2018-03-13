import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    username: string;

  constructor(private navCtrl: NavController,
              private toast: ToastController) {
  }

  navigateToPage(pageName:string){
    this.navCtrl.push(pageName);
  }

  getUsername(){

  }

  presentToast(){
    this.toast.create({
        message: "Welcome back, " + this.username,
        duration: 3000
    }).present();
  }

  doLogin(){
    this.navCtrl.setRoot('HomePage');
  }

}
