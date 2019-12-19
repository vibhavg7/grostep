//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Product} from '../../models/product';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
/**
 * Cart Item
 */
export class CartItem {
  _id:String;
  title:String;
  product_name_hindi : String;
  price:number;
  weight : number;
  combo : String;
  available_multiple_quantity : String;
  available_quantity_type : String;
  combo_description : String;
  //fruit_imgs:String;
  product_img: String;
  product_type: Number;
  quantity:number;
  main_category_name : string;
//   sub_category_name: String;
  
    constructor(item : Product, quantity:number) {      
      this._id = item._id;
      this.title = item.product_name;
      this.product_name_hindi = item.product_name_hindi;
      this.combo = item.combo;
      this.available_multiple_quantity = item.available_multiple_quantity;
      this.available_quantity_type = item.available_quantity_type;
      this.combo_description = item.combo_description;  
      //this.price = item.our_price * (weight/250);
      this.price = item.our_price;
      this.product_img = item.product_img;
      this.product_type = item.product_type;
      this.weight = item.selected_weight;
      this.quantity = quantity;
     this.main_category_name = item.main_category_name;
    //   this.sub_category_name = item.sub_category_name;
  }
}


/*
  Generated class for the CartServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartService {

BASE_URL = 'https://newhealthyfieapi.herokuapp.com/';

list : Array<CartItem>; 

constructor(public http: Http) {
    this.list = [];
}



getAllCartItems()
{    
    return this.list;
}

checkEmptyCart()
{    
    // console.log('empty cart');
    return this.list.length == 0 ? true : false;
}

getcartproductQuantity(product:Product) : number
{    
    // console.log(product);
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i]._id == product._id)
            return this.list[i].quantity;    
    }
    return 0;
}

removeAllCartItems()
{    
    this.list = [];    
}



getItemById(id: String){
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i]._id == id){
            return this.list[i];
        }
    }
}

// addItem(item : Product, quantity:number , weight : number){
addItem(item : Product, quantity:number){
    var isExists : boolean = false;
    var id = item._id;
    console.log(item);
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i]._id == id && this.list[i].weight == item.selected_weight){
            this.list[i].quantity += quantity;
            this.list[i].price = this.list[i].price;            
            //this.list[i].price = this.list[i].price * (weight/250);
            isExists = true;
            break;
        }
    }
    if(!isExists){
        //this.list.push(new CartItem(item, quantity,weight));
        this.list.push(new CartItem(item, quantity));
        console.log(this.list);
    }    
}

removeItem(item : Product, quantity:number){
    
    var isExists : boolean = false;
    var id = item._id;
    
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i]._id == id){            
             if(this.list[i].quantity == 1)            
                 this.list.splice(i, 1);                
            else
            this.list[i].quantity -= quantity;
                            
            isExists = true;
            break;
        }
    }   
}


removeItemById(id){        
    for(var i = 0; i < this.list.length; i++){
        if(this.list[i]._id == id){
            this.list.splice(i, 1);
            break;
        }
    }
}

emptyCart(registerData){        
    
    var orderData = { "Orderdetails" : '',"Ordertype" : "1","delievrydetails" : registerData, "orderStatus": "1","CouponCodeApplied":"1"};
    this.http.post(this.BASE_URL + 'orders', orderData).subscribe(res => {
        //this.authenticate(res);
    })
    console.log(orderData);
}

quantityPlus(item){
    item.quantity += 1;
}

quantityMinus(item){
    item.quantity -= 1;
}

getDeliveryCharge() : number
{
  var deliveryCharge = 0;
  var amount = this.getGrandTotal();
  if(amount >= 50)
  {
    deliveryCharge = 0;
  }
  else
  {
    deliveryCharge = 30;
  }
  return deliveryCharge;
}

getGrandTotal(): number{
    var amount = 0;
    for(var i = 0; i < this.list.length; i++){
      var product_price : any = this.list[i].price;
      
      amount += (product_price* this.list[i].quantity);
    }    
    return amount;
}

}
