import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  contactLists:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public data: DataProvider,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.contactLists = this.data.contacts;
    console.log('here');
  }

  contactSelected(item){
    console.log(item);
  }

  createAlert(){
    this.alertCtrl.create({
        title: "Add User",
        message: "Please input user's E-Mail",
        inputs: [
            {
              name: 'username',
              placeholder:'Username or Email'
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
                // if valid
                  // blablabla
                // else
                  // blablabla
              }
            }
        ]
    }).present();
  }
}
