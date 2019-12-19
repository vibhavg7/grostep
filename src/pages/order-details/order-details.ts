import { Component } from '@angular/core';
import { NavController, NavParams,Platform,LoadingController,AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { OrderService } from '../../providers/order-service/order-service';
import { Orders } from '../../models/orders';
import { Product } from '../../models/product';
import { CancelledOrderPage } from '../cancelled-order/cancelled-order';
/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
  order_id : any;
  loading : any;
  order_Id : any;
  amount_to_pay : number;
  shipping_charge : number;
  delivery_address : String;
  delivery_date : String;
  delivery_time : String;
  payableAmount : number;
  payment_mode : String;
  placingdatetime : String;
  cancelleddatetime : String;
  purchased_item : any;
  savingAmount : number;
  total_purchased_item : any;
  orderStatus : any;  
  //orderDetails : Orders;  
  productArray : Product[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform : Platform,
              private orderService: OrderService,private network : Network,
              private loadingCtrl : LoadingController,private alerCtrl : AlertController) 
  {
    if(navParams.get('order_id') == undefined) 
      this.order_id = '' ; 
    else 
      this.order_id = navParams.get('order_id'); 
      console.log(this.order_id);
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }


  ionViewWillEnter()
  {          
    // this.loading.dismiss();
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {     
          this.createLoader();
          this.loading.present().then(() => {
            this.orderService.getOrderDataById(this.order_id).subscribe(orderdata => {
              this.loading.dismiss();
              this.orderStatus =orderdata.status;
              this.order_Id = orderdata._id;
              this.orderStatus = orderdata.status;
              this.payment_mode = orderdata.payment_mode;
              this.payableAmount= orderdata.payableAmount;
              this.savingAmount = orderdata.savingAmount;
              this.placingdatetime = orderdata.placingdatetime;
              this.cancelleddatetime = orderdata.cancelleddatetime;
              this.amount_to_pay = orderdata.amount_to_pay;
              this.shipping_charge = orderdata.shipping_charge;              
              this.delivery_address = JSON.parse(orderdata.delivery_address).flatNumber + ' '+ JSON.parse(orderdata.delivery_address).location + ' ' + JSON.parse(orderdata.delivery_address).address;
              this.delivery_date = orderdata.delivery_date;
              this.delivery_time = orderdata.delivery_time;
              this.purchased_item = JSON.parse(orderdata.purchased_item);                            
            }, error => {
              this.loading.dismiss();               
            })
          })
      }
    })
  }  

  cancelOrder()
  {

    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        let confirm = this.alerCtrl.create({
          title: 'Cancel Order',
          subTitle: 'Are you sure you want to cancel the order?',
          // cssClass: 'alertDanger',
          buttons: [
            {
              text: 'No',
              cssClass:'cancelcss',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              cssClass:'removecss',
              handler: () => {    
                this.createLoader();
                this.loading.present().then(() => {
                  this.orderService.cancelOrderById(this.order_id).subscribe(cancelorder =>
                    {
                      if(cancelorder.statusCode == '200')
                      {
                        this.loading.dismiss();
                        this.navCtrl.push(CancelledOrderPage)
                      }
                    })
                });                      
              }
            }
          ]
        });
        confirm.present();
      }
    });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
  }

}
