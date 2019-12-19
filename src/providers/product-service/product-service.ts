import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Product} from '../../models/product';
/*
  Generated class for the DelievryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductService {
  
  products : Array<Product>; 

  BASE_URL = 'https://grostep.herokuapp.com/';

  constructor(public http: Http) {
    
  }

  getAllMainCategory() : any
  {
    return this.http.get(this.BASE_URL+ 'products/productcategories')
    .map(
      res => {
        console.log(res.json());
        //this.products = res.json(); 
        return res.json();
      }
    );
  }

  getproducts() : any
  {
    return this.products;
  }

  getAllProducts() : any
  {
    return this.http.get(`${this.BASE_URL}products/`)
    .map((res)=>{ return res.json() });
  }

  getproductdetail(_id: string,category: string) : Observable<Product>
  {
    //console.log(`${this.BASE_URL}${category}/${_id}`);
    return this.http.get(`${this.BASE_URL}products/${_id}`)
    .map((res)=>{ return res.json() });    
  }

  // getProductByCategoryId(_id: string,category: string) : Observable<Product[]> {        
  //   return this.http.get(`${this.BASE_URL}${category}/${_id}`)
  //   .map(
  //     res => {
  //       console.log(res.json());
  //       //this.products = res.json(); 
  //       return <Product[]>res.json();
  //     }
  //   );

  getProductByCategoryId(_id: string,category: string) : any {        
    return this.http.get(`${this.BASE_URL}${category}/${_id}`)
    .map(
      res => {
        console.log(res.json());
        //this.products = res.json(); 
        return res.json();
      }
    );
    // return this.http.get(this.BASE_URL+ category)
    // .map(
    //   res=> {
    //     this.products = res.json();         
    //     return this.products;
    //   }
    //   //res => <Product[]>res.json()
    // );
  }

  searchProducts(key): Observable<Product[]> {
    var category = 'search/searchkey';   
    return this.http.get(`${this.BASE_URL}${category}/${key}`)
    .map(
      res=> {
        this.products = res.json();         
        return this.products;
      }
      //res => <Product[]>res.json()
    );
  }
  
  getProductDetails(_id: string,category: string): Observable<Product> {
    //console.log(`${this.BASE_URL}fruits/${_id}`);
    return this.http.get(`${this.BASE_URL}${category}/${_id}`)
      .map(res => <Product>(res.json()))
  } 

}
