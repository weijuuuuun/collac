import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  groups:any =[
      {
          name:'Group One',
          id: 1
      },
      {
          name:'Group Two',
          id: 2
      },
      {
          name:'Group Three',
          id: 3
      },
      {
          name:'Group Four',
          id: 4
      }
  ];

  contacts:any =[
      {
          name:'FriendOne',
          id: 1
      },
      {
          name:'FriendTwo',
          id: 2
      },
      {
          name:'FriendThree',
          id: 3
      },
      {
          name:'FriendFour',
          id: 4
      }
  ]

  constructor() {
  }

}
