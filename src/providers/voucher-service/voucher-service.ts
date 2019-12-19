import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Voucher } from '../../models/voucher';
/*
  Generated class for the VoucherServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VoucherService {
  BASE_URL = 'https://newhealthyfieapi.herokuapp.com/coupon/';
  private TOKEN_KEY = "token";
  constructor(public http: Http) {
    console.log('Hello VoucherServiceProvider Provider');
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +
    localStorage.getItem(this.TOKEN_KEY));    
    console.log(headers);
  }

  getAllVoucher() : Observable<Voucher[]> {
    var _id = localStorage.getItem(this.TOKEN_KEY);
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    // return this.http.get(`http://newhealthyfieapi.herokuapp.com/orders/users/orders/${_id}`,{
    //   headers: headers
    // })
    // .map((res)=>{ return res.json() }       
    // );    
    return this.http.get(`https://newhealthyfieapi.herokuapp.com/coupon/user/mycoupon/${_id}`,{
      headers: headers
    })
    .map(
      res => <Voucher[]>res.json()
    );
  }

  // getVoucherByLocation(location) : Observable<Voucher[]> 
  // {
  //   return this.http.get(this.BASE_URL+ + 'coupon/' +location)
  //   .map(res => <Voucher[]>res.json());
  // }

  public applyVoucherCode(obj) : any
  {    
    // console.log(obj);    
    return this.http.post(this.BASE_URL+'user/applycoupon',obj)
    .map((res) => {      
      let voucherData = res.json();      
      //console.log(voucherData);
      return voucherData;        
    })
  }
  
  public applyVoucher(addinfo) : any
  {
    return this.http.post(this.BASE_URL+ 'usercoupon',addinfo)
    .map((res) => {
      //console.log(res.json)
      let voucher = res.json();      
      
      return voucher;        
    })
  }


  

}
