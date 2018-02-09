import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';


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
