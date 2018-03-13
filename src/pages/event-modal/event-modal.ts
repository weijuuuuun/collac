import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";


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


    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {

        let preselectedDate = new Date(this.navParams.get('selectedDay'));
        preselectedDate.setHours(8);                    // make 8am as default start time
        let selected = moment(preselectedDate).format();
        this.event.startTime = selected;

        let addOneHour = preselectedDate.setHours(9);   // make 9am as default end time
        let selectedAdded = moment(addOneHour).format();
        this.event.endTime = selectedAdded;
    }

    save(){
        this.viewCtrl.dismiss(this.event);
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
}
