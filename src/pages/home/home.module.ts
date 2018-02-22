import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

// Calendar Module
import {NgCalendarModule} from "ionic2-calendar";

@NgModule({
  declarations: [
    HomePage,

  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
