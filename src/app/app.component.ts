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

  initializeApp() {
      this.platform.ready().then(() => {
          this.statusBar.styleLightContent();
          this.splashScreen.hide();

          this.initializeUserEvents();
          this.initializeUserTasks();

          // Initialize some options
          this.initializeOptions();
      });

      // Change the value for the batch every 5 seconds
      setInterval(() => {
          this.unreadCountObservable.next(Math.floor(Math.random() * 10));
      }, 5000);
  }

  private initializeUserEvents(): void {
    this.userService.userEvents
      .subscribe(events => {
        console.log("Called initialize event subscribe");

        this.cachedUserEvents = events;
        this.initializeUserTasks();
        this.initializeOptions();
        console.log(this.cachedUserEvents);
      })
  }

  private initializeUserTasks(): void {
    this.userService.userTasks
      .subscribe(tasks => {
        this.cachedUserTasks = tasks;
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
          component: HomePage,
          itemId: cachedEvent.id,
          badge: this.unreadCountObservable //currently random
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
          component: ContactPage,

      });
      this.options.push({
          iconName: 'fa fa-users',
          displayName: 'Groups',
          component: GroupPage,

      });
      this.options.push({
          iconName: 'fa fa-cogs',
          displayName: 'Settings',
          component: HomePage,

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
          this.navCtrl.setRoot(option.component || HomePage, { 'title': option.displayName });
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
        this.navCtrl.setRoot('LoginPage');

      }, err => {
        console.log("app.component.ts: Error cleaning local storage");
        console.log(err);
      })

  }
}

