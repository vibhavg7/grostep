import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AppServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppServiceProvider {

  BASE_URL = "https://grostep.herokuapp.com/";
  constructor(public http: Http) {
    console.log('Hello AppServiceProvider Provider');
  }

  getInfo(category : String) : any
  {    
    return this.http.get(this.BASE_URL + category)
    .map(res=> {
      // console.log(res.json()[0]);
      // console.log('-------------');
      return  res.json()[0];
    });
  }
}
