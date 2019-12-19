import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeolocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocationServiceProvider {
  BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
  API_KEY = 'AIzaSyAnnPq2lEkle7sCEfQ-hAr0ytoR7pFZ_HI';
  constructor(public http: Http) {
    console.log('Hello GeolocationProvider Provider');
  }

  getLocation(lat,long) : any
  {
    return this.http.get(this.BASE_URL + 'key' + this.API_KEY + '&latlng=' + lat + ',' + long)
   .map(res=> {
    //console.log(res.json());
     return  res.json();       
   }) 
  }

}
