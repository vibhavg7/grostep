import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Banner } from '../../models/banner';
/*
  Generated class for the BannerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BannerServiceProvider {
  BASE_URL = 'https://grostep.herokuapp.com/';
  private TOKEN_KEY = "token";
  constructor(public http: Http) {
    console.log('Hello BannerServiceProvider Provider');
  }

  getAllBanners() : Observable<Banner[]> {
    return this.http.get(this.BASE_URL+ 'banners')
    .map(
      res => <Banner[]>res.json()
    );
  }

}
