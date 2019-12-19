import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { VoucherPage } from '../voucher/voucher';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  grandTotal : number;
  deliveryCharge :  number;
  payableAmount : number;
  totalSaving :number;
  voucherApplied : boolean;
  voucherPercentage : number;  
  discountedValue :number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.grandTotal = navParams.get('grandTotal');
    this.deliveryCharge = navParams.get('deliveryCharge');
    this.voucherApplied = navParams.get('voucherApplied');
    this.grandTotal = navParams.get('grandTotal');
    this.voucherPercentage = navParams.get('voucherPercentage');
    this.discountedValue = this.grandTotal * (this.voucherPercentage/100);    
    this.payableAmount = this.grandTotal;
    if(this.discountedValue)
      this.payableAmount = this.grandTotal - this.discountedValue;
    console.log(this.grandTotal + '-' + this.discountedValue + '--' + this.payableAmount);
  }

  // voucherPage()
  // {
  //   this.navCtrl.push(VoucherPage,{grandTotal:this.grandTotal,deliveryCharge : this.deliveryCharge});
  //   // this.navCtrl.push(VoucherPage,{grandTotal:this.grandTotal,deliveryCharge : this.deliveryCharge})
  //   // .then(() => {
  //   //   const startIndex = this.navCtrl.getActive().index - 2;
  //   //   this.navCtrl.remove(startIndex, 2);
  //   // });
  // }

  removeVoucher()
  {
    this.voucherApplied = false;
    this.payableAmount = this.grandTotal;
  }

  pay()
  {
    // var options = {
    //   description: 'Credits towards consultation',
    //   image: 'https://i.imgur.com/3g7nmJC.png',
    //   currency: 'INR',
    //   key: 'rzp_test_1DP5mmOlF5G5ag',
    //   amount: '5000',
    //   name: 'foo',
    //   prefill: {
    //     email: 'pranav@razorpay.com',
    //     contact: '8879524924',
    //     name: 'Pranav Gupta'
    //   },
    //   theme: {
    //     color: '#F37254'
    //   },
    //   modal: {
    //     ondismiss: function() {
    //       alert('dismissed')
    //     }
    //   }
    // };
    
    // var successCallback = function(payment_id) {
    //   alert('payment_id: ' + payment_id);
    // };

    // var cancelCallback = function(error) {
    //   alert(error.description + ' (Error ' + error.code + ')');
    // };

    // RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
  placeOrder()
  {
   // this.navCtrl.push(CheckoutPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

}
