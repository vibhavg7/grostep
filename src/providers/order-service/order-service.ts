import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

// import { Orders} from '../../models/orders';

/*
  Generated class for the OrderServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderService {

  BASE_URL = "https://grostep.herokuapp.com/";
  private TOKEN_KEY = "token";
  constructor(public http: Http) {
    console.log('Hello OrderServiceProvider Provider');
  }

 
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +
    localStorage.getItem(this.TOKEN_KEY));    
    // console.log(headers);
  }

  postorder(obj)
  {    
    console.log(obj);
    return this.http.post(this.BASE_URL+'orders/postorder',obj)
    .map((response: Response) => {
      return response;    
    })
  }

  getAllOrders() : any
  {
    var _id = localStorage.getItem(this.TOKEN_KEY);
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(`${this.BASE_URL}orders/users/orders/${_id}`,{
      headers: headers
    })
    .map((res)=>{ return res.json() }       
    );    
  }  

  getOrderDataById(order_id) : any
  {
    //console.log(order_id);
    var _id = order_id;
    let headers = new Headers();
    this.createAuthorizationHeader(headers);    
    return this.http.get(`${this.BASE_URL}orders/${_id}`,{
      headers: headers
    })
    .map((res)=>{ console.log(res.json());  return res.json() }       
    );    
  }

  cancelOrderById(order_id) : any
  {
     var _id = order_id;    
    let headers = new Headers(
      
      {'authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY) }
    );

    let options = new RequestOptions({ headers: headers });
    console.log(options);
     return this.http.post(`${this.BASE_URL}orders/users/cancelOrder/${_id}`, {}, options)
    .map(res=> {    
      console.log(res.json());         
      return  res.json();       
    })     

  }
}
