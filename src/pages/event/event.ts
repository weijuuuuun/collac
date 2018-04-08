import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {EventService} from "../../providers/EventService";
import {UserService} from "../../providers/UserService";
import {User} from "../../models/User";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";

@IonicPage()
@Component({
    selector: 'page-event',
    templateUrl: 'event.html',
})
export class EventPage {
    id: number;
    userId: number;
    userFirstname: string;
    userLastname: string;
    title: string;
    startTime: string;
    endTime: string;
    notes: string;
    memberList: any;
    owner: any;
    tasks: any;
    loggedInUser: User;
    friendList: any;
    tempUserFirstname: any;
    tempUserId: any;
    tasksIsEmpty: boolean = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                private eventService: EventService,
                private userService: UserService,
                private localStorageHelper: LocalStorageHelper) {

        this.id = this.navParams.get("itemId");
        this.title = this.navParams.get("itemTitle");
        this.endTime = moment(this.navParams.get("itemDue")).format('lll');
        this.notes = this.navParams.get("itemNotes");
    }

    addTaskAlert() {
        this.alertCtrl.create({
            title: "Add Task",
            message: "Please input user's Email",
            inputs: [
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
                        for (let i = 0; i < this.memberList.length; i++) {
                            if (data.username == this.memberList[i].email) {
                                console.log(this.memberList[i].id);
                                console.log(data.title);
                                this.alertCtrl.create({
                                    title: 'Successful',
                                    message: 'User has been added',
                                    buttons: [
                                        {
                                            text: 'ok'
                                        }
                                    ]
                                }).present();
                            }
                        }
                    }
                }
            ]
        }).present();
    }

    addMemberRadio() {
        let memberAlert = this.alertCtrl.create();
        memberAlert.setTitle('Add Member');

        if (this.memberList.length == 0) {
            for (let i = 0; i < this.friendList.length; i++) {
                memberAlert.addInput({
                    type: 'checkbox',
                    label: this.friendList[i].firstName,
                    value: this.friendList[i].id
                });
            }
        }

        /*
          If the memberList is not empty,
          Get diff between friendList and memberList
          to avoid duplicate entry
        */
        else if (this.memberList.length > 1) {

            var temp = [], diff = [];

            for (let i = 0; i < this.memberList.length; i++) {
                temp[this.memberList[i].id] = true;
            }

            for (let j = 0; j < this.friendList.length; j++) {
                if(temp[this.friendList[j].id]){
                    delete temp[this.friendList[j].id];
                } else {
                    temp[this.friendList[j].id] = true;
                }
            }

            for (let k in temp){
                diff.push(k);
            }

            console.log(diff);

            for(let l = 0; l < diff.length; l ++){
                if (diff[l] != this.userId){
                    console.log(diff[l] + ' ' + this.userId)
                    this.userService.getUser(diff[l])
                        .subscribe( userData => {
                            console.log(userData);
                            this.tempUserFirstname = userData.firstName;
                            this.tempUserId = userData.id
                        });
                    memberAlert.addInput({
                        type: 'checkbox',
                        label: this.tempUserFirstname,
                        value: this.tempUserId
                    });
                }
            }
        }
        memberAlert.addButton('Cancel');
        memberAlert.addButton({
            text: 'Add',
            handler: (data: any) => {
                console.log("Add Member: " + data);
            }
        });

        memberAlert.present();
    }

    launchChat() {
        console.log("Messenger: Event " + this.id);
        this.navCtrl.push(ChatPage, {
            title: this.title,
            id: this.id
        });
    }

    ionViewWillEnter() {
        this.getEventMembers();
        this.getEventOwner();
        this.getEventTasks();
        this.localStorageHelper.getLoggedInUser()
            .then(user => {
                this.loggedInUser = user;
                this.userId = user.id;
                this.userFirstname = user.firstName;
                this.userLastname = user.lastName;
                this.userService.getFriends(this.loggedInUser.id)
                    .subscribe(friendsData => {
                        this.friendList = friendsData;
                    }), err => {
                    console.log(err);
                }
            });
    }

    getEventMembers() {
        this.eventService.getEventMember(this.id)
            .subscribe(eventData => {
                console.log("event.ts: Received event data.");
                this.memberList = eventData;
                //console.log(this.memberList);
            }, err => {
                console.log("event.ts: Error getting event data.");
                console.log(err);
            });
    }

    getEventOwner() {
        this.eventService.getEventOwner(this.id)
            .subscribe(ownerData => {
                console.log("event.ts: retrieved owner data.");
                this.owner = ownerData.id;
                //console.log(ownerData);
            }, err => {
                console.log("event.ts: error getting owner data");
                console.log(err);
            });
    }

    getEventTasks() {
        this.eventService.getEventTask(this.id)
            .subscribe(eventTask => {
                console.log("event.ts: retrieved tasks");
                //console.log(eventTask);
                this.tasks = eventTask;

                if(eventTask.length == 0) {
                    this.tasksIsEmpty = true;
                }

                this.tasksIsEmpty = false
            })
    }

}
