import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {EventService} from "../../providers/EventService";
import {TaskService} from "../../providers/TaskService";
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
  owner: any;
  tasks:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private eventService: EventService,
              private taskService: TaskService) {
    this.id = this.navParams.get("itemId");
    this.title = this.navParams.get("itemTitle");
    // this.endTime = moment(new Date()).format('lll');
    this.endTime = moment(this.navParams.get("itemDue")).format('lll');
    this.notes = this.navParams.get("itemNotes");
  }

  addTaskAlert(){
      this.alertCtrl.create({
          title: "Add Task",
          message: "Please input user's Email",
          inputs:[
              {
                  name: 'username',
                  placeholder: 'Username or Email'
              },
              {
                  name: 'title',
                  placeholder: 'Task Name'
              }
          ],
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                      console.log('Cancelled');
                  }
              },
              {
                  text: 'Add',
                  role: 'submit',
                  handler: data => {
                      console.log(data.username);
                      // if valid
                      // blablabla
                      // else
                      // blablabla
                  }
              }
          ]
      }).present();
  }

    addMemberAlert(){
        this.alertCtrl.create({
            title: "Add Member",
            message: "Please input user's Email",
            inputs:[
                {
                    name: 'username',
                    placeholder: 'Username or Email'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancelled');
                    }
                },
                {
                    text: 'Add',
                    role: 'submit',
                    handler: data => {
                        console.log(data.username);
                        // if valid
                        // blablabla
                        // else
                        // blablabla
                    }
                }
            ]
        }).present();
    }

  launchChat(){
      console.log("Messenger: Event " + this.id);
      this.navCtrl.push(ChatPage,{
          title: this.title,
          id: this.id
      });
  }

  ionViewWillEnter() {
    this.getEventMembers();
    this.getEventOwner();
    this.getEventTasks();
  }

  getEventMembers(){
      this.eventService.getEvent(this.id)
          .subscribe(eventData => {
              console.log("event.ts: Received event data.");
              this.memberList = eventData;
              console.log(this.memberList);
          }, err => {
              console.log("event.ts: Error getting event data.");
              console.log(err);
          });
  }

  getEventOwner(){
      this.eventService.getEventOwner(this.id)
          .subscribe(ownerData => {
              console.log("events.ts: retrieved owner data.");
              this.owner = ownerData.id;
              console.log(ownerData);
          }, err => {
              console.log("event.ts: error getting owner data");
              console.log(err);
          });
  }

  getEventTasks(){
    this.eventService.getEventTask(this.id)
        .subscribe(eventTask => {
            console.log("event.ts: retrieved tasks");
            console.log(eventTask);
            this.tasks = eventTask;

        })
  }
}
