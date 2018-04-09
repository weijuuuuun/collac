import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {EventService} from "../../providers/EventService";
import {UserService} from "../../providers/UserService";
import {User} from "../../models/User";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";
import {TaskService} from "../../providers/TaskService";
import {Task} from "../../models/Task";

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
    ownerId: any;
    ownerName: any;
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
                private taskService: TaskService,
                private localStorageHelper: LocalStorageHelper) {

        this.id = this.navParams.get("itemId");
        this.title = this.navParams.get("itemTitle");
        this.endTime = moment(this.navParams.get("itemDue")).format('lll');
        this.notes = this.navParams.get("itemNotes");
    }

    addTaskAlert() {
        this.alertCtrl.create({
            title: "Add Task",
            message: "Please input Task title",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Task Title'
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
                        console.log(data.title);
                        let newTaskToCreate: Task = {
                            creator:{
                                id: this.userId
                            },
                            title: data.title
                        }
                        // console.log(newTaskToCreate);
                        this.eventService.createTask(newTaskToCreate,this.id)
                            .subscribe(newTaskId => {
                                newTaskToCreate.id = newTaskId

                                // Clone current tasks
                                let newTask = this.tasks.slice(0);
                                newTask.push(newTaskToCreate);

                                // Update task
                                this.eventService.updateEventTasks(newTask);
                                this.getEventTasks();
                            })
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
                console.log(data);
                let newMembersToAdd: any = [];
                for(let i = 0; i < data.length; i++){
                    newMembersToAdd.push({
                        id: data[i]
                    });
                }
                console.log(newMembersToAdd);
                this.eventService.eventAddMember(this.id,newMembersToAdd)
                    .subscribe(addMember => {
                        console.log(addMember);
                    })

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
                this.ownerId = ownerData.id;
                this.ownerName = ownerData.firstName;
                //console.log(ownerData);
            }, err => {
                console.log("event.ts: error getting owner data");
                console.log(err);
            });
    }

    getEventTasks() {
        this.eventService.populateEventTasks(this.id);
        this.eventService.getEventTask(this.id)
            .subscribe(eventTask => {
                console.log("event.ts: retrieved tasks");
                // console.log(eventTask);
                this.tasks = eventTask;
                this.tasksIsEmpty = false

                if(eventTask.length == 0) {
                    this.tasksIsEmpty = true;
                }
            })
    }

    assignTask(taskId: number){
        let showMembers = this.alertCtrl.create();
        showMembers.setTitle("Assign Member");

        showMembers.addInput({
            type: 'radio',
            label: this.ownerName,
            value: this.ownerId
        });

        // add members to list
        for(let i = 0; i < this.memberList.length; i++) {
            showMembers.addInput({
                type: 'radio',
                label: this.memberList[i].firstName,
                value: this.memberList[i].id
            });
        }

        showMembers.addButton('Cancel');
        showMembers.addButton({
            text: 'Assign',
            handler: (data: number) => {
                this.eventService.setAssigned(taskId,data)
                    .subscribe(assigned =>{
                        console.log(assigned);
                        console.log("assigned: " + data);
                    })
            }
        });

        showMembers.present();
    }

}
