import { Component, ViewChild } from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

//@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})

export class ChatPage {
    @ViewChild(Content) content: Content;
    title: string = '';
    username: string = '';
    message: string = '';
    _chatSubscription;
    messages: object[] = [];

    constructor(public db: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams) {

        this.title = this.navParams.get('title');       // get title from param
        this.username = this.navParams.get('username'); // get user name from param

        // Subscribe to the selected chat  @TODO: /branchname in Firebase
        this._chatSubscription = this.db.list('/' + this.title).valueChanges().subscribe( data => {
            this.messages = data;
            this.autoScroll();
        });
    }

    scrollToBottom(){
        if(this.content._scroll) this.content.scrollToBottom(200);
    }

    autoScroll(){
        setTimeout(() => {
            this.scrollToBottom();
        }, 200);
    }

    sendMessage() {
        this.db.list('/' + this.title).push({
            username: this.username,
            message: this.message
        }).then( () => {
            // message is sent
        });
        //     .catch( () => {
        //     // some error. maybe firebase is unreachable
        // });
        this.message = '';
    }

    ionViewDidLoad() {
        // this.db.list('/chat').push({
        //     specialMessage: true,
        //     message: `${this.username} has joined the room`
        // });
    }

    ionViewDidEnter(){
        this.autoScroll();
    }

    // ionViewWillLeave(){
    //     this._chatSubscription.unsubscribe();
    //     this.db.list('/chat').push({
    //         specialMessage: true,
    //         message: `${this.username} has left the room`
    //     });
    // }
}
