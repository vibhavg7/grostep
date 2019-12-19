import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { of as observableOf } from 'rxjs/observable/of'
// import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {Address} from '../../models/address';

/*
  Generated class for the AddressServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AddressService {
  public token: string;
  private NAME_KEY = "name";
  private TOKEN_KEY = "token";
  BASE_URL = "https://grostep.herokuapp.com/deliveryAddress/";
  addressselected : any;
  selectedeliverydate:string = '';
  selectedeliverytime :string = '';


  constructor(public http: Http) {
    console.log('Hello AddressServiceProvider Provider');
  }

  addDeliveryInfo(address:Address,date:string,time:string) : Observable<boolean>
  {
    this.addressselected = address;
    this.selectedeliverydate = date;
    this.selectedeliverytime = time;   
    return observableOf(true);
    //console.log(this.addressselected);
  }
  
  emptyDeliveryInfo()
  {
    this.selectedeliverydate = '';
    this.selectedeliverytime = '';
    this.addressselected = '';

  }
  getaddressInfo() : Address
  {
    return this.addressselected;
  }

  getdateselectedInfo() : string
  {
    return this.selectedeliverydate;
  }

  gettimeselectedInfo() : string
  {
    return this.selectedeliverytime;
  }
  
  createAuthorizationHeader(headers: Headers) {    
    headers.append('Authorization', 'Bearer ' +
    localStorage.getItem(this.TOKEN_KEY));    
  }

   addDelievryAddress(address) : any
   {   
    return this.http.post(this.BASE_URL,address)
    .map((response: Response) => {
      
      let addressid = response.json().addressid;      
      
      if (addressid) {                   
          return true;
      } else {          
          return false;
      }          
    })
   }

  public editDelievryAddressStatus(address) : any
  {   
    console.log(address);
    return this.http.post(this.BASE_URL+ 'editStatus',address)
    .map((res) => {    
      let addressid = res.json().addressid;      
      if (addressid) {                   
          return true;
      } else {          
          return false;
      }          
    })
  }

  editDelievryAddress(id,address)
  {    
    var category = 'update/';   
      return this.http.post(`${this.BASE_URL}${category}${id}`,address)
      .map((res) => {        
        return res.json();        
      })
  }

  deleteDeliveryAddress(id)
  {
    var category = 'delete/';
  
    return this.http.post(`${this.BASE_URL}${category}${id}`,{})
    .map((res) => {        
      return res.json();        
    })
  }

  getDelievryAddress() : any
  {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this.http.get(this.BASE_URL + 'user/me',{
      headers: headers
    })
    .map(res=> {
      return  res.json();       
    });
  }

  getDelievryAddressById(_id: string) : Observable<Address>
  {
      return this.http.get(`${this.BASE_URL}${_id}`)
          .map(res => <Address>(res.json())) ;
  }

  getMyDelievryAddress(tokenId: string) : Observable<Address>
  {    
      return this.http.get(`${this.BASE_URL}user/${tokenId}`)
          .map(res => <Address>(res.json())) ;
  }

  getDeliverydatetime() : any
  {
    return this.http.get(this.BASE_URL + 'deliverydate')
    .map(res=> {
      return  res.json();       
    });
  }
}
