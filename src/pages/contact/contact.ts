import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {UserService} from "../../providers/UserService";
import {LocalStorageHelper} from "../../helpers/LocalStorageHelper";
import {User} from "../../models/User";

@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
})
export class ContactPage {
    contactLists: any;
    loggedInUser: User;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public data: DataProvider,
                public alertCtrl: AlertController,
                private userService: UserService,
                private localStorageHelper: LocalStorageHelper) {
    }

    ionViewWillEnter() {
        this.localStorageHelper.getLoggedInUser()
            .then(user => {
                if (!user) {
                    console.log("contact.ts: No logged in user data");
                }
                this.loggedInUser = user;
                this.userService.getFriends(this.loggedInUser.id)
                    .subscribe(friendsData => {
                        console.log("contact.ts: Received friends data.");
                        //console.log(friendsData);
                        this.contactLists = friendsData;
                    }, err => {
                        console.log("contact.ts: Error getting friends data");
                        console.log(err);
                    })
            });
    }



    // ionViewDidLoad() {
    //   this.contactLists = this.data.contacts;
    //   console.log('here');
    // }

    contactSelected(item) {
        console.log(item);
    }

    createAlert() {
        this.alertCtrl.create({
            title: "Add User",
            message: "Please input user's E-Mail",
            inputs: [
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
                    }
                }
            ]
        }).present();
    }
}
