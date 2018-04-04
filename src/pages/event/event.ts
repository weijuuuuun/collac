import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";


@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  members = [];
  notes: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = this.navParams.get("itemId");
    this.title = this.navParams.get("itemTitle");
    // this.endTime = moment(new Date()).format('lll');
    this.endTime = moment(this.navParams.get("itemDue")).format('lll');
    this.notes = this.navParams.get("itemNotes");
  }

  launchChat(){
      console.log("Messenger: Event " + this.id);
      this.navCtrl.push(ChatPage,{
          title: this.title,
          id: this.id
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

}
