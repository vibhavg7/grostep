import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartService } from '../cart-service/cart-service';

@Injectable()
export class AuthService {
  HAS_LOGGED_IN = 'hasLoggedIn';
  public token: string;
  private NAME_KEY = "name";
  private TOKEN_KEY = "token";
  private EMAIL_KEY = "email";
  private usertoken: string;

  BASE_URL = "https://grostep.herokuapp.com/auth/";
  ORDER_URL = "https://grostep.herokuapp.com/";
  constructor(public http: Http,public storage:Storage,public events: Events,private cartService: CartService)
  {
    //console.log('Hello AuthServiceProvider Provider');
  }

  get name()
  {
    return localStorage.getItem(this.NAME_KEY);
  }

  get username() : any
  {    
    return localStorage.getItem(this.NAME_KEY);
  }

  get isauthenticated()
  {
      return localStorage.getItem(this.TOKEN_KEY);
  }
  
  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +
    localStorage.getItem(this.TOKEN_KEY)); 
    
  }

  getUserProfile() : any
  {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    // console.log(headers);
     return this.http.get(this.BASE_URL + 'users/me',{
       headers: headers
     })
    .map(res=> {
      // console.log(res.json());
      return  res.json();       
    }) 
  }

  getUserOrders() : any
  {
    // let myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');    
    // let myParams = new URLSearchParams();
    // myParams.append('id', localStorage.getItem(this.TOKEN_KEY));	
    // let options = new RequestOptions({ headers: myHeaders, params: myParams });

    //  return this.http.get("https://newhealthyfieapi.herokuapp.com/orders",options)
    // .map(res=> {
    //   return  res.json();       
    // }) 
  }

  changePwd(userData) : any
  {    
    // let headers = new Headers(
    //   {'authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY) + ' opwd ' + userData.opwd + ' pwd ' +userData.npwd }
    // );

    let headers = new Headers(
      {'authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY) + ' pwd ' + userData.npwd }
    );

    let options = new RequestOptions({ headers: headers });
    console.log(options);
     return this.http.post(this.BASE_URL + 'change-pass', {}, options)
    .map(res=> {            
      return  res.json();       
    })     
  }

changeforgetPwd(usercredentials) 
{
  return this.http.post(this.BASE_URL+'change-forget-pass',usercredentials)
  .map((response: Response) => {
    // login successful if there's a jwt token in the response
    // console.log(response);
     return response.json();
  })
}


  sendOTP(email1)
  {
    var json = { "email" : email1};
    return this.http.post("https://newhealthyfieapi.herokuapp.com/forgetpassword/send",json)
    .map((response: Response) => {
      // login successful if there's a jwt token in the response
      // console.log(response);
       return response.json();
    })
  }

 

  setUsername(response): void {
    // console.log(response);
    this.storage.set('name1', response.json().name);
    this.storage.set('email1', response.json().email);
    this.storage.set('token1', response.json().token);
  };

  dofbRegister(user):any{
    return this.http.post(this.BASE_URL + 'register',user)
    .map((response: Response) => {
      // login successful if there's a jwt token in the response
       return this.authenticate(response);
    })
  }

  dogoogleRegister(user):any{
    return this.http.post(this.BASE_URL + 'register',user)
    .map((response: Response) => {
      // login successful if there's a jwt token in the response
       return this.authenticate(response);
    })
  }

  login(user) : any
  {    
    return this.http.post(this.BASE_URL + 'login',user)
    .map((response: Response) => {
      console.log(response);
      // login successful if there's a jwt token in the response
       return this.authenticate(response);
    })
  }

  postorder(obj) : any
  {  
    // console.log(obj);
    return this.http.post('http://localhost:3000/auth/postorder',obj)
    .map((response: Response) => {
      return response;    
    })
  }

  register(user,PrevPage) : any
  {   
    return this.http.post(this.BASE_URL + 'register',user)
    .map((response: Response) => {
      // console.log(response);      
      //if(PrevPage !='')
        return this.authenticate(response);        
      //return this.authenticateRegister(response); 
    })
  }


  contactus(contactus) : any
  {        
    return this.http.post(this.BASE_URL + 'contactus',contactus)
    .map((response: Response) => {
      return this.authenticateRegister(response);      
    })
  }

  authenticateRegister(response) : any
  {    
    if(response.json().success)
    {           
     return true;
    }
    else
    {            
      return false;
    }
  }

  authenticate(response) : any
  {
    console.log(response.json())
    if(response.json().success)
    {
        let token = response.json().token;
        let username = response.json().name;
        let email = response.json().email;
        let phoneNumber = response.json().phoneNumber;
        let name = response.json().name;

        if (token) {       
          this.storage.set(this.HAS_LOGGED_IN, true);
          //this.setUsername(response);
          localStorage.setItem(this.NAME_KEY, username);
          localStorage.setItem(this.TOKEN_KEY, token );
          localStorage.setItem(this.EMAIL_KEY, email );
          localStorage.setItem("phoneNumber", phoneNumber );          

          this.events.publish('user:login');                                 
            return true;
        }
        else        
          return false;    
    }
    else
      return false;
  }

  logout()
  {
      this.cartService.removeAllCartItems();
      localStorage.removeItem(this.EMAIL_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.NAME_KEY);
      localStorage.removeItem("phoneNumber");
      this.storage.remove(this.HAS_LOGGED_IN);
      // this.storage.remove('name1');
      // this.storage.remove('email1');
      // this.storage.remove('token1');
      this.events.publish('user:logout');

  }
}
