import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  username: string;

  calendar = {
      mode: 'month',
      currentDate: this.selectedDay
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public  storage: Storage,
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

  ionViewWilload() {
      // when the page will load, this method is called
      // call the backend, to retrieve data on events
      // get the data, display in html
  }

  // Display Month
  onTitleChanged(title){
      this.viewTitle = title;
  }

  onTimeSelected(ev){
      this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event){
      /* test console
      console.log("Title:" + event.title);
      console.log("Start: " + event.startTime);
      console.log("End: " + event.endTime);
      console.log("Noti: " + event.notification);
      console.log("Group: " + event.group);
      */
      let start = moment(event.startTime).format('llll');
      let end = moment(event.endTime).format('llll');

      let alert = this.alertCtrl.create({
          title: '' + event.title,
          subTitle: 'From: ' + start + '<br>To: ' + end + '<br>With: ' + event.group,
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                      console.log('Cancelled')
                  }
              },
              {
                text: 'Edit',
              },
              {
                  text: "Message",
                  handler: () => {
                      console.log('Open messanger');
                  }
              }
          ]
      });
      alert.present();

  }

  goToday(){
      this.calendar.currentDate = new Date();
  }

  loadRandomEvents(){
      var events = [];
      for (var i = 0; i < 20; i ++) {
          var date = new Date();
          var startDay = Math.floor(Math.random() * 90) - 30;                   // random day between (2 months ahead | 1 month before)
          var endDay = Math.floor(Math.random() * 2) + startDay;                // random duration (0,1,2)
          var startMinute = Math.floor(Math.random() * 24 * 60);                // random minutes (max of 24 hours)
          var endMinute = Math.floor(Math.random() * 3 * 24) + startMinute;     // random duration between (max of 3 hours)
          var startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
          var endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
          events.push({
              title: 'Random Event - ' + i,
              startTime: startTime,
              endTime: endTime,  // get ridz
              allDay: false
          });
      }
      return events;
  }

  launchChat(){

      this.storage.get('username').then((val) => {
          console.log('Your name is', val);
          this.navCtrl.push(ChatPage,{
              username: val
          });
      });

      // this.navCtrl.push(ChatPage,{
      //     username: this.storage.get('username');
      // });
  }

  ionViewWillEnter(){
      //this.eventSource = this.loadRandomEvents();
  }
}


