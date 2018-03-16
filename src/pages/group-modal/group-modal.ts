import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-modal',
  templateUrl: 'group-modal.html',
})
export class GroupModalPage {

  group = {}

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  save(){
      this.viewCtrl.dismiss(this.group);
      console.log(this.group);
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }

}
