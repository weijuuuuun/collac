import {Component, ViewChild} from '@angular/core';
import {AlertController, MenuController, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// RxJS
import {ReplaySubject} from "rxjs/ReplaySubject";

// Side Menu Component
import {SideMenuContentComponent} from "../shared/side-menu-content/side-menu-content.component";
import {MenuOptionModel} from "../shared/side-menu-content/models/menu-option-model";
import {SideMenuSettings} from "../shared/side-menu-content/models/side-menu-settings";
import {HomePage} from "../pages/home/home";




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = 'LoginPage';

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
              private toast: ToastController) {
      this.initializeApp();
  }

  initializeApp() {
      this.platform.ready().then(() => {
          this.statusBar.styleLightContent();
          this.splashScreen.hide();

          // Initialize some options
          this.initializeOptions();
      });

      // Change the value for the batch every 5 seconds
      setInterval(() => {
          this.unreadCountObservable.next(Math.floor(Math.random() * 10));
      }, 5000);
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
      this.options.push({
          displayName: 'Topics',
          subItems: [
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingOne',
                  component: HomePage
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingTwo',
                  component: HomePage,
                  badge: this.unreadCountObservable //currently random
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingThree',
                  component: HomePage,
                  badge: this.unreadCountObservable //currently random
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingFour',
                  component: HomePage
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingFive',
                  component: HomePage,
                  badge: this.unreadCountObservable //currently random
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingSix',
                  component: HomePage
              },
              {
                  iconName:'fa fa-hashtag',
                  displayName: 'TestingSeven',
                  component: HomePage
              }

          ]
      });
      this.options.push({
          displayName: 'Task',
          subItems: [
              {
                  displayName: 'TaskOneTwoThree',
                  component: HomePage
              },
              {
                  displayName: 'TaskThreeFourFive',
                  component: HomePage
              },
              {
                  displayName: 'TaskSixSevenEight',
                  component: HomePage,
                  badge: this.unreadCountObservable
              }
          ]

      });

      // Load simple menu options
      // ------------------------------------------
      this.options.push({
          iconName: 'fa fa-users',
          displayName: 'Groups',
          component: HomePage,

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

  public presentToast(){
    this.toast.create({
      message: "Logged Out",
      duration: 3000
  }).present();
}

  public doLogout(){
      this.navCtrl.setRoot('LoginPage');
  }
}

