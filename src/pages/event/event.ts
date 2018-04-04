import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";


@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  title: string;
  startTime: string;
  endTime: string;
  members: string;
  notes: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = "title";
    this.startTime = moment(new Date()).format('lll');
    this.endTime = moment(new Date()).format('lll');
    this.groupName = "group one"
    this.notes = "desc"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

}
