import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

// Custom Components
import {SideMenuContentComponent} from "../shared/side-menu-content/side-menu-content.component";
import {GroupPage} from "../pages/group/group";
import { DataProvider } from '../providers/data/data';
import {ContactPage} from "../pages/contact/contact";


@NgModule({
  declarations: [
    MyApp,
    SideMenuContentComponent,
    GroupPage,
    ContactPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroupPage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider
  ]
})
export class AppModule {}
