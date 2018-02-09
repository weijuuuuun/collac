import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(private navCtrl: NavController) {
  }

  popPage(){
      this.navCtrl.pop();
  }

}
