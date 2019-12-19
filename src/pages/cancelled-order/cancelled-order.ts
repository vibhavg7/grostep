import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { SegmentPage } from '../segment/segment';

/**
 * Generated class for the CancelledOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cancelled-order',
  templateUrl: 'cancelled-order.html',
})
export class CancelledOrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private platform : Platform,
              private network:Network) 
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelledOrderPage');
  }

  continueShopping()
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

}
