import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {EventService} from "../../providers/EventService";
import {User} from "../../models/User";

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
  notes: string;
  memberList:any;
  owner: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eventService: EventService) {
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

  ionViewWillEnter() {
     this.eventService.getEventMembers(this.id)
         .subscribe(eventData => {
             console.log("event.ts: Received event data.");
             this.memberList = eventData;
             console.log(this.memberList);
         }, err => {
             console.log("event.ts: Error getting event data.");
             console.log(err);
         });
     this.eventService.getEventOwner(this.id)
         .subscribe(ownerData => {
              this.owner = ownerData;
              console.log(this.owner);
          }, err => {
              console.log(err);
          });

  }
}
