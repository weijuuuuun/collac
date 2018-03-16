import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  groupLists:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public data: DataProvider,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.groupLists = this.data.groups;
  }

  groupSelected(item){
    console.log(item);
    // navCtrl to go to conversation
  }

  addGroup(){
    let modal = this.modalCtrl.create('GroupModalPage');
    modal.present();
  }

}
