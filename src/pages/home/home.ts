import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
      mode: 'month',
      currentDate: this.selectedDay
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
  }

  addEvent(){
    let modal = this.modalCtrl.create('EventModalPage',{selectedDay: this.selectedDay});
    modal.present();

    // data retrieve when modal is dismissed
    modal.onDidDismiss(data => {
        if(data){
            let eventData = data;

            eventData.startTime = new Date(data.startTime);
            eventData.endTime = new Date(data.endTime);

            // assign current eventSource to new event
            let events = this.eventSource;
            events.push(eventData);
            this.eventSource = [];
            setTimeout(() => {
                this.eventSource = events;
            });
        }
    });
  }

  // Display Month
  onTitleChanged(title){
      this.viewTitle = title;
  }

  onTimeSelected(ev){
      this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event){
  }

}


