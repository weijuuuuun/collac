import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

// Custom Components
import {SideMenuContentComponent} from "../shared/side-menu-content/side-menu-content.component";
import {GroupPage} from "../pages/group/group";
import {DataProvider} from '../providers/data/data';
import {ContactPage} from "../pages/contact/contact";
import {AuthenticationService} from "../providers/AuthenticationService";
import {HttpClientModule} from "@angular/common/http";
import {Apollo, ApolloModule} from "apollo-angular";
import {HttpLink, HttpLinkModule} from "apollo-angular-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {EventService} from "../providers/EventService";
import {IonicStorageModule} from "@ionic/storage";
import {ChatPage} from "../pages/chat/chat";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {UserService} from "../providers/UserService";
import {LocalStorageHelper} from "../helpers/LocalStorageHelper";
import {LoginPageModule} from "../pages/login/login.module";
import {EventPage} from "../pages/event/event";
import {TaskService} from "../providers/TaskService";
// Firebase config
var config = {
    apiKey: "AIzaSyAIrkjicK4M9CWrRfEYIz32h2snBNxQD2s",
    authDomain: "testing-chat-286d1.firebaseapp.com",
    databaseURL: "https://testing-chat-286d1.firebaseio.com",
    projectId: "testing-chat-286d1",
    storageBucket: "testing-chat-286d1.appspot.com",
    messagingSenderId: "644631641224"
};

@NgModule({
  declarations: [
    MyApp,
    SideMenuContentComponent,
    GroupPage,
    ContactPage,
    ChatPage,
    EventPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroupPage,
    ContactPage,
    ChatPage,
    EventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    AuthenticationService,
    EventService,
    UserService,
    TaskService,
    LocalStorageHelper
  ]
})
export class AppModule {

  constructor(apollo: Apollo, httpLink: HttpLink){


    apollo.create({
        link: httpLink.create({uri: 'http://localhost:9001/graphql'}),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            fetchPolicy: 'network-only'
          },
          watchQuery: {
            fetchPolicy: 'network-only'
          }
        }
    });
  }
}
