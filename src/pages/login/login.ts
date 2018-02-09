import { Component } from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private navCtrl: NavController,
              private toast: ToastController) {
  }

  navigateToPage(pageName:string){
    this.navCtrl.push(pageName);
  }

  presentToast(){
    this.toast.create({
        message: "Welcome back, Mothafakaaa",
        duration: 3000
    }).present();
  }

}
