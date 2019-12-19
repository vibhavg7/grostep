import { Component } from '@angular/core';
import { NavController, NavParams,Platform,LoadingController,Loading } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { OrderService } from '../../providers/order-service/order-service';
import { Orders } from '../../models/orders';
import { OrderDetailsPage } from '../order-details/order-details';
import { SegmentPage } from '../segment/segment';

/**
 * Generated class for the MyordersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-myorders',
  templateUrl: 'myorders.html',
})
export class MyordersPage {

  ordersList : Orders[];
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform : Platform,
              private network :Network,private orderService : OrderService,
              private loadingCtrl: LoadingController) 
  {

  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      this.loading = this.loadingCtrl.create({
        content: 'Please Wait..'
      });
      this.loading.present().then( () =>{    
          if(this.network.type == "none")      
          {
            this.loading.dismiss();            
            alert('No Internet Connection Found');
          }
          else
          {      
            this.orderService.getAllOrders().subscribe((orders)=>{
               console.log(orders);
                this.ordersList = orders;
                this.ordersList.sort(function(a, b){
                  var keyA = new Date(a.placingdatetime),
                      keyB = new Date(b.placingdatetime);
                  // Compare the 2 dates
                  if(keyA > keyB) return -1;
                  if(keyA < keyB) return 1;
                  return 0;
              });
              console.log(this.ordersList);
              this.loading.dismiss();
            })           
          }
      })      
    })
  }

  startShopping()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.setRoot(SegmentPage);
      }
    })
   
  }

  orderdetails(order)
  {
    // console.log(order._id);
    this.navCtrl.push(OrderDetailsPage,{order_id:order._id});     
  }

  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyordersPage');
  }



}
