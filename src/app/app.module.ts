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
import {AuthenticationService} from "../providers/AuthenticationService";
import {HttpClientModule} from "@angular/common/http";
import {Apollo, ApolloModule} from "apollo-angular";
import {HttpLink, HttpLinkModule} from "apollo-angular-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {EventService} from "../providers/EventService";


@NgModule({
  declarations: [
    MyApp,
    SideMenuContentComponent,
    GroupPage,
    ContactPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
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
    DataProvider,
    AuthenticationService,
    EventService
  ]
})
export class AppModule {

  constructor(apollo: Apollo, httpLink: HttpLink){
    apollo.create({
        link: httpLink.create({uri: 'http://localhost:9001/graphql'}),
        cache: new InMemoryCache()
    });
  }
}
