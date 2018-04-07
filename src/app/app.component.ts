import {Component, ViewChild} from '@angular/core';
import {AlertController, MenuController, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {ReplaySubject} from "rxjs/ReplaySubject";
import {SideMenuContentComponent} from "../shared/side-menu-content/side-menu-content.component";
import {MenuOptionModel} from "../shared/side-menu-content/models/menu-option-model";
import {SideMenuSettings} from "../shared/side-menu-content/models/side-menu-settings";
import {HomePage} from "../pages/home/home";
import {GroupPage} from "../pages/group/group";
import {ContactPage} from "../pages/contact/contact";
import {LocalStorageHelper} from "../helpers/LocalStorageHelper";
import {UserService} from "../providers/UserService";
import {Event} from "../models/Event";
import {Task} from "../models/Task";
import {EventPage} from "../pages/event/event";
import {promisify} from "util";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = 'LoginPage';
  cachedUserEvents: Event[] = [];
  cachedUserTasks: Task[] = [];

  @ViewChild(Nav) navCtrl: Nav;

  // Get the instance to call the public methods
  @ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

  // Options to show in the SideMenuComponent
  public options: Array<MenuOptionModel>;

  // Settings for the SideMenuComponent
  public sideMenuSettings: SideMenuSettings = {
    accordionMode: true,
    showSelectedOption: true,
    selectedOptionClass: 'active-side-menu-option',
    subOptionIndentation:{
        md: '56px',
        ios: '64px',
        wp: '56px'
    }
  };

  private unreadCountObservable: any = new ReplaySubject<number>(0);

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private menuCtrl: MenuController,
              private toast: ToastController,
              private localStorageHelper: LocalStorageHelper,
              private userService: UserService) {

      this.initializeApp();
  }




  // subscribes and gets updates
  initializeApp() {
      this.platform.ready().then(() => {
          this.statusBar.styleLightContent();
          this.splashScreen.hide();

          this.initializeUserEvents();
          // Initialize some options
          this.initializeOptions();
      });

      // Change the value for the batch every 5 seconds
      setInterval(() => {
          this.unreadCountObservable.next(Math.floor(Math.random() * 10));
      }, 5000);
  }

  private initializeUserEvents(): void {
    this.userService.getEventsObservable()
      .subscribe(events => {
        console.log("app.component.ts: Called initialize event subscribe");
        console.log(events);

        this.userService.getTasksObservable()
          .subscribe(tasks => {
            this.cachedUserEvents = events;
            this.cachedUserTasks = tasks;
            this.initializeOptions();
          })

      })
  }


  private initializeOptions(): void {
      this.options = new Array<MenuOptionModel>();
      // Load simple menu options
      // ------------------------------------------
      this.options.push({
          iconName: 'fa fa-calendar',
          displayName: 'Home',
          component: HomePage,

          // This option is already selected
          selected: true
      });

      // Load options with nested items
      //-------------------------------------------

      let eventOptionItems = this.cachedUserEvents.map(cachedEvent => {
        return {
          iconName: 'fa fa-hashtag',
          displayName: cachedEvent.title,
          itemId: cachedEvent.id,
          custom: {
              isEvent: true,
              itemId: cachedEvent.id,
              itemName: cachedEvent.title,
              event: cachedEvent
          }
          //badge: this.unreadCountObservable //currently random
        };
      });

      this.options.push({
          displayName: 'Events',
          subItems: eventOptionItems
      });


    let taskOptionItems = this.cachedUserTasks.map(cachedTask => {
      return {
        iconName: 'fa fa-hashtag',
        displayName: cachedTask.title,
        component: HomePage,
        itemId: cachedTask.id
      };
      
    });
      this.options.push({
          displayName: 'Task',
          subItems: taskOptionItems
      });

      // Load simple menu options
      // ------------------------------------------
      this.options.push({
          iconName: 'fa fa-address-book',
          displayName: 'Contacts',
          custom: {
              isPage: true,
              pageName: ContactPage
          }
      });

      this.options.push({
          iconName: 'fa fa-cogs',
          displayName: 'Settings'
          //component: HomePage
      });
  }

  public selectOption(option: MenuOptionModel): void {
      this.menuCtrl.close().then(() => {
          // if (option.custom && option.custom.isLogin) {
          //     this.presentAlert('You\'ve clicked the login option!');
          // } else if (option.custom && option.custom.isLogout) {
          //     this.presentAlert('You\'ve clicked the logout option!');
          // } else if (option.custom && option.custom.isExternalLink) {
          //     let url = option.custom.externalUrl;
          //     window.open(url, '_blank');
          // } else {
          //     // Redirect to the selected page
          //     this.navCtrl.setRoot(option.component || HomePage, { 'title': option.displayName });
          // }
          if(option.custom && option.custom.isEvent){
              //this.presentAlert('You\'ve clicked the event: ' + option.custom.itemName);
              this.navCtrl.push(EventPage,{
                  itemId: option.custom.event.id,
                  itemTitle: option.custom.event.title,
                  itemDue: option.custom.event.due,
                  itemNotes: option.custom.event.description
              });
          }
          else if(option.custom && option.custom.isPage) {
              this.navigateToPage(option.custom.pageName);
          } else {
              //this.navCtrl.setRoot(option.component || HomePage, { 'title': option.displayName });
          }

      });
  }

  public collapseMenuOptions(): void {
      this.sideMenu.collapseAllOptions();
  }

  public presentAlert(message: string): void {
      let alert = this.alertCtrl.create({
          title: 'Information',
          message: message,
          buttons: ['Ok']
      });
      alert.present();
  }

  public navigateToPage(pageName:string){
      this.navCtrl.push(pageName);
  }

  /**
    Present toast to let user know that they've logged out successfully.
   */
  public presentToast(){
    this.toast.create({
      message: "Logged Out",
      duration: 3000
  }).present();
}

  /**
    Upon logout, clear Local storage that stores user information
   */
  public doLogout(){
    this.localStorageHelper.clearLocalStorage()
      .then(() => {
        console.log("app.component.ts: successfully cleared local storage");
        this.userService.clearCachedEvents();
        this.userService.clearCachedTasks();

        this.navCtrl.setRoot('LoginPage');

      }, err => {
        console.log("app.component.ts: Error cleaning local storage");
        console.log(err);
      })

  }
}

