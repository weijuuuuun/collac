import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import {User} from "../../models/User";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";

//@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})

export class ChatPage {
    @ViewChild(Content) content: Content;
    title: string = '';
    eventId: string = '';
    username: string = '';
    firstName: string = '';
    message: string = '';
    _chatSubscription;
    messages: object[] = [];
    loggedInUser: User;

    constructor(public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams,
                private localStorageHelper: LocalStorageHelper) {

        this.title = this.navParams.get('title');       // get title from param
        this.eventId = this.navParams.get('id');


        // Subscribe to the selected chat  @TODO: /branchname in Firebase
        this._chatSubscription = this.db.list('/eventid' + this.eventId).valueChanges().subscribe(data => {
            this.messages = data;
            this.autoScroll();
        });
    }

    scrollToBottom() {
        if (this.content._scroll) this.content.scrollToBottom(200);
    }

    autoScroll() {
        setTimeout(() => {
            this.scrollToBottom();
        }, 200);
    }

    sendMessage() {
        this.db.list('/eventid' + this.eventId).push({
            username: this.username,
            message: this.message
        }).then(() => {
            // message is sent
        });
        //     .catch( () => {
        //     // some error. maybe firebase is unreachable
        // });
        this.message = '';
    }

    // this is to show special message when user enters to the chat
    ionViewDidLoad() {
        // this.db.list('/chat').push({
        //     specialMessage: true,
        //     message: `${this.username} has joined the room`
        // });
    }

    ionViewDidEnter() {
        this.autoScroll();
    }

    ionViewWillEnter() {
        this.localStorageHelper.getLoggedInUser()
            .then(user => {
                if (!user) {
                    console.log("chat.ts: No logged in user data")
                }
                this.loggedInUser = user;
                this.username = this.loggedInUser.email;
                this.firstName = this.loggedInUser.firstName;
            });
    }

    // ionViewWillLeave(){
    //     this._chatSubscription.unsubscribe();
    //     this.db.list('/chat').push({
    //         specialMessage: true,
    //         message: `${this.username} has left the room`
    //     });
    // }
}
