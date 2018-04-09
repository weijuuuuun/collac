import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import * as moment from "moment";
import {ChatPage} from "../chat/chat";
import {Storage} from "@ionic/storage";
import {UserService} from "../../providers/UserService";
import {Event} from "../../models/Event";
import {EventPage} from "../event/event";
import {User} from "../../models/User";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";
import {EventService} from "../../providers/EventService";
import {CalendarComponent} from "ionic2-calendar/calendar";


@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    eventSource = [];
    cachedUserEvents: Event[] = [];
    viewTitle: string;
    selectedDay = new Date();
    username: string;
    loggedInUser: User;

    @ViewChild(CalendarComponent) myCalendar: CalendarComponent;

    calendar = {
        mode: 'month',
        currentDate: this.selectedDay
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public  storage: Storage,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private userService: UserService,
                private eventService: EventService,
                private localStorageHelper: LocalStorageHelper) {


    }


    ionViewWillLoad() {
        this.initializeUserEvents();
        this.localStorageHelper.getLoggedInUser()
            .then(user => {
                this.loggedInUser = user;
            });
    }


    addEvent() {
        let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
        modal.present();

        // data retrieve when modal is dismissed
        modal.onWillDismiss(data => {
            if (data) {
                let newEventToCreate: Event = {
                    title: data.title,
                    description: data.notes,
                    owner: {
                        id: this.loggedInUser.id
                    },
                    due: moment(data.endTime).format('YYYY-MM-DD h:mm:ss')
                };

                this.eventService.createEvent(newEventToCreate)
                    .subscribe(newEventId => {
                        // Add event to your id
                        newEventToCreate.id = newEventId;

                        // Clone your current events
                        let newEvents = this.eventSource.slice(0);
                        newEvents.push(newEventToCreate);

                        // Push new item to eventSource
                        this.eventSource.push({
                            id: newEventToCreate.id,
                            title: newEventToCreate.title,
                            startTime: new Date(moment(newEventToCreate.due).format()),
                            endTime: new Date(moment(newEventToCreate.due).format()),
                            notes: newEventToCreate.description
                        });

                        console.log(this.eventSource);

                        // Add Members to Event
                        // if (data.member.length > 0) {
                        //     let newMembers : any = [];
                        //     for (let i = 0; i < data.member.length; i++) {
                        //         let id : any = {
                        //             id : data.member[i]
                        //         }
                        //         newMembers.push(id);
                        //     }
                        //     console.log(newMembers);
                            // this.eventService.eventAddMember(newEventToCreate.id, newMembers)
                            //     .subscribe(member => {
                            //         console.log(member);
                            //     })
                        // }
                        this.myCalendar.loadEvents();
                        this.userService.updateCachedEvent(newEvents);
                    });
            }
        });
    }

    initializeUserEvents() {
        console.log("calling initialize user events");
        this.userService.getEventsObservable()
            .subscribe(events => {
                //console.log("home.ts: events observable subscribe called");
                //console.log(events);
                this.cachedUserEvents = events;
                this.loadEvents();
            }, err => {
                console.log("Error getting events");
                console.log(err);
            });
    }

    loadEvents() {

        // This code should only run to initialize for the first time
        if (this.eventSource.length != 0) {
            return;
        }

        let someEvent = this.cachedUserEvents.map(cachedEvents => {
            return {
                id: cachedEvents.id,
                title: cachedEvents.title,
                startTime: new Date(moment(cachedEvents.due).format()),
                endTime: new Date(moment(cachedEvents.due).format()),
                notes: cachedEvents.description
            };
        });

        this.eventSource = [];
        someEvent.forEach(event => this.eventSource.push(event));

        //console.log(this.eventSource);
        this.myCalendar.loadEvents();


    }

    // Display Month
    onTitleChanged(title) {
        this.viewTitle = title;
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }

    onEventSelected(event) {
        /* test console
        console.log("Title:" + event.title);
        console.log("Start: " + event.startTime);
        console.log("End: " + event.endTime);
        console.log("Noti: " + event.notification);
        console.log("Group: " + event.group);
        */
        let end = moment(event.endTime).format('llll');

        let alert = this.alertCtrl.create({
            title: ' ' + event.title,
            subTitle: 'Due: ' + end + '<br>With: ' + event.group,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancelled')
                    }
                },
                {
                    text: 'View',
                    handler: () => {
                        this.navCtrl.push(EventPage, {
                            itemId: event.id,
                            itemTitle: event.title,
                            itemDue: event.due,
                            itemNotes: event.notes
                        });
                    }
                },
                {
                    text: "Message",
                    handler: () => {
                        console.log('Open messanger');
                        this.navCtrl.push(ChatPage, {
                            title: event.title,
                            id: event.id
                        });
                    }
                }
            ]
        });
        alert.present();

    }

    goToday() {
        this.calendar.currentDate = new Date();
    }

    loadRandomEvents() {
        var events = [];
        for (var i = 0; i < 20; i++) {
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
                endTime: endTime,
                allDay: false
            });
        }
        return events;
    }

    launchChat() {

        this.navCtrl.push(ChatPage, {
            title: 'Announcement'
        });


        // this.navCtrl.push(ChatPage,{
        //     username: this.storage.get('username');
        // });
    }

}


