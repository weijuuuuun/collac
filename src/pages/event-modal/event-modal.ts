import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";
import {UserService} from "../../providers/UserService";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";
import {User} from "../../models/User";
import {EventService} from "../../providers/EventService";

@IonicPage()
@Component({
    selector: 'page-event-modal',
    templateUrl: 'event-modal.html',
})
export class EventModalPage {
    start = new Date(new Date().setHours(8));
    event = {
        startTime: new Date(new Date().setHours(8)).toISOString(),
        endTime: new Date().toISOString(),
        allDay: false
    }
    minDate = new Date().toISOString();

    memberList:any;
    loggedInUser: User;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                private userService: UserService,
                private  localStorageHelper: LocalStorageHelper) {

        let preselectedDate = new Date(this.navParams.get('selectedDay'));
        preselectedDate.setHours(8); // make 8am as default time
        let selected = moment(preselectedDate).format();
        this.event.endTime = selected;
    }

    ionViewWillEnter(){
        this.localStorageHelper.getLoggedInUser()
            .then(user=>{
                if(!user){
                    console.log("event-modal.ts: No logged in user data");
                }
                this.loggedInUser = user;
                this.userService.getFriends(this.loggedInUser.id)
                    .subscribe(friendsData => {
                        console.log("event-modal.ts: Received friends data.");
                        console.log(friendsData);
                        this.memberList = friendsData;
                    }, err => {
                        console.log("event-modal.ts: Error getting friends data");
                        console.log(err);
                    })
            });
    }

    save(){
        this.viewCtrl.dismiss(this.event);
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
}