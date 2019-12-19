import { Component } from '@angular/core';
import {NavController, NavParams,Platform,MenuController,Events  } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SegmentPage } from '../segment/segment';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import { HomePage } from '../home/home';
/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {

  order_id : any;
  cartList : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform : Platform,
              public events : Events,
              private network: Network,
              private menu: MenuController,public cartService : CartService) {
  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.order_id = this.navParams.get('order_id');          
        console.log(this.order_id);
      }
    })
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(false, 'menu1');
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  continueShopping()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.setRoot(HomePage);
      }
    })
   
  }

  ionViewWillLeave() {

   
    // Don't forget to return the swipe to normal, otherwise 
    // the rest of the pages won't be able to swipe to open menu
    // if(this.cartService.checkEmptyCart())      
    //   this.navCtrl.setRoot(SegmentPage); 
    //this.events.publish('success');     
    //this.navCtrl.pop(); 
    this.menu.swipeEnable(true);
    // this.events.publish('success');

    // If you have more than one side menu, use the id like below
    // this.menu.swipeEnable(true, 'menu1');
   }

   ionViewDidLeave()
   {
     
   }

   ionViewWillUnload()
   {
    
   }
}
