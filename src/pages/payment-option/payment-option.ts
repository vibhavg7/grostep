import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import {  NavController, NavParams,Platform,LoadingController,ToastController,
  Loading,Events,AlertController } from 'ionic-angular';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import { VoucherService } from '../../providers/voucher-service/voucher-service';
import { AddressService } from '../../providers/address-service/address-service';
import { OrderService } from '../../providers/order-service/order-service';
import { Address } from '../../models/address';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { SuccessPage } from '../../pages/success/success';
import { SegmentPage } from '../segment/segment';
import { MyCouponsPage } from '../../pages/my-coupons/my-coupons';

/**
 * Generated class for the PaymentOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment-option',
  templateUrl: 'payment-option.html',
})
export class PaymentOptionPage {
  selectedeliverydate:string = '';
  selectedeliverytime :string = '';
  nav : NavController;
  cartList : any;
  loading: Loading;
  totalAmount : any;
  deliveryCharge : number;
  payableAmount : any;
  couponCode : string = '';
  voucherApplied : boolean = false;
  discountedValue : number = 0;
  voucherData : any;
  shownGroup = null;
  showDetails : boolean = false;
  showVoucher : boolean = false;
  showPaymentDetails : boolean  =true;
  showDeliveryAddress : boolean  =false;
  addressinfo :  Address;
  appliedCouponCode : string = '';
  checkedIdx: number = 0;
  options = [
    'Cash On Delivery',
    'Card On Delivery',
    'Paytm on Delivery',
    'Sodexo'
    ,'Online Payment'
    // 'PayuMoney Wallet',confirmOrder
    // 'Pay with Paytm Wallet',
    // 'Credit/ Debit Card',
    // 'Net Banking',
    // 'PayZapp',
    // 'Pay using MobiKwiK Wallet'
  ];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private network : Network,
        public voucherService : VoucherService,private cartService : CartService,
        private toastCtrl : ToastController , private addressService : AddressService
        ,private platform : Platform,private loadingCtrl: LoadingController,
        private alertCtrl : AlertController,
        private orderService: OrderService,private events :Events) 
  {
    this.nav = navCtrl;    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
      {
          this.hideLoading();
          alert('No Internet Connection Found');
          this.navCtrl.setRoot(BlankPage);
      }
    });
  }


  changePaymentOption(e,index)
  {
    if(e){      
      this.checkedIdx = index
      if(this.checkedIdx == 4) 
      this.presentOnlinePaymentAlert();
    }
    else
    {
      this.checkedIdx = -1;
    }
  }
  ionViewWillEnter()
  {     
     this.platform.ready().then(() => {
      if(this.network.type == "none")      
      {
          this.hideLoading();
          alert('No Internet Connection Found');
          this.navCtrl.setRoot(BlankPage);
      }
      else
      {        
        
        if(!this.loading){
          this.loading = this.loadingCtrl.create({
              content: 'Please Wait...'
          });
          this.loading.present();
        }

        if(this.cartService.checkEmptyCart())
        {
          this.hideLoading();
          this.navCtrl.setRoot(SegmentPage);  
        }
        else
        {          
             this.cartList = this.cartService.getAllCartItems();       
             this.addressinfo = this.addressService.getaddressInfo();
             this.selectedeliverydate = this.addressService.getdateselectedInfo();
             this.selectedeliverytime = this.addressService.gettimeselectedInfo();        
             this.deliveryCharge = 0;
            if( this.navParams.get('voucherApplied') != undefined 
                &&this.navParams.get('discountedValue') != undefined
                &&this.navParams.get('deliveryCharge') != undefined
                // && this.navParams.get('payableAmount') != undefined 
                && this.navParams.get('codeName')!= undefined)
            {              
               this.voucherApplied = this.navParams.get('voucherApplied');
               this.appliedCouponCode = this.navParams.get('codeName');
               this.discountedValue = this.navParams.get('discountedValue');
               this.deliveryCharge = this.navParams.get('deliveryCharge');              
               this.payableAmount = this.getTotal() - this.discountedValue   + this.getDeliveryCharge();
            //   //this.navParams.get('payableAmount');
              this.showPaymentDetails = true;
            }
            this.hideLoading();       
        }
      }
    });
  }
  
  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  togglecartlist()
  {
    if (this.showDetails) {
      this.showDetails = false;   
      this.showPaymentDetails = true;         
    } 
    else {
      this.showVoucher = false;
      this.showDeliveryAddress = false;
      this.showDetails = true;
      this.showPaymentDetails = false;      
    }
  }

  togglevoucher()
  {
    if (this.showVoucher) 
    {
      this.showVoucher = false;      
      this.showPaymentDetails = true;
    } 
    else {
      this.showVoucher = true;
      this.showDetails = false;
      this.showDeliveryAddress = false;
      this.showPaymentDetails = false;      
    }
  }

  togglepayment()
  {
    if (this.showPaymentDetails) 
    {
      this.showPaymentDetails = false;      
    } 
    else {
      this.showVoucher = false;
      this.showDetails = false;
      this.showDeliveryAddress = false;
      this.showPaymentDetails = true;
    }
  }
  toggleDeliveryAddress()
  {
    if (this.showDeliveryAddress) 
    {
      this.showDeliveryAddress = false;      
      this.showPaymentDetails = true;
    } 
    else {
      this.showVoucher = false;
      this.showDetails = false;
      this.showPaymentDetails = false;
      this.showDeliveryAddress = true;
    }
  }
  
  getTotal(): number{
    this.totalAmount = this.cartService.getGrandTotal();  
    return this.totalAmount;
  }
  
  getDeliveryCharge() : number
  {
    //return this.deliveryCharge;
    return this.cartService.getDeliveryCharge();
  }
  
  getMySavings() : number
  {    
    if(!this.voucherApplied)
      return this.discountedValue;
    return this.discountedValue;
  }
  
  getPayableAmount()
  {
    if(!this.voucherApplied)
    {
      return this.totalAmount  + this.getDeliveryCharge();
    }     
    return this.payableAmount;
  }

  availableCouponCode()
  {
    // console.log("available coupon code");  
    this.navCtrl.push(MyCouponsPage);
  }

  applyCouponCode()
  {    
    if(this.couponCode !='')
    {
      if(!this.loading){
        this.loading = this.loadingCtrl.create({
            content: 'Please Wait...'
        });        
      }
      this.loading.present();
      var obj = {"tokenId":localStorage.getItem("token"),"couponCode":this.couponCode,"orderAmount":this.getTotal() };      
      this.voucherService.applyVoucherCode(obj)
      .subscribe(voucherData => {
        
        this.voucherData = voucherData;   
        
        console.log(this.voucherData);
        if(this.voucherData.statusCode == 500 ||this.voucherData.statusCode == 400)
        {          
          this.presentToast('Coupon code not applicable');
        }
        else if(this.voucherData.statusCode == 200)
        {
          this.voucherApplied = true;  
          this.showVoucher = true;    
          this.appliedCouponCode = this.couponCode;            
          if(this.voucherData.voucherinfo[0].CalculateByPercentage)
            this.discountedValue = this.getTotal() * (this.voucherData.voucherinfo[0].savingPercentage/100);          
          else
            this.discountedValue = this.voucherData.voucherinfo[0].couponValue;          
          this.payableAmount = this.getTotal() - this.discountedValue   + this.deliveryCharge;        
          this.presentToast('Coupon Code Applied');
        }
        this.hideLoading();
        // this.loading.dismiss();             
      })      
    }
    else
      this.presentToast('Enter Coupon Code');      
  }
  
  getAppliedVoucherCode() : string
  {    
    return this.appliedCouponCode;
  }

  removeVoucher()
  {
    this.voucherApplied = false;  
    this.discountedValue = 0;
    this.appliedCouponCode = '';
    this.payableAmount = this.totalAmount;
    this.presentToast('Coupon Code Removed');
  }
  
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      // cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {      
    });
  
    toast.present();
  }
    
  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  presentOnlinePaymentAlert() {
    let alert = this.alertCtrl.create({
      // title: 'Low battery',
      subTitle: 'Note : When you click on Place Order - Your order will be placed first and then you will be redirected to payment page.',
      buttons: [{
        text: 'Ok',
        cssClass:'alertCss',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }

  public confirmOrder()
  {
    var orderobj = {};    
    orderobj['token'] = localStorage.getItem("token");
    orderobj['purchased_item'] = JSON.stringify(this.cartList);
    orderobj['total_purchased_item'] = this.cartList.length;    
    orderobj['delivery_address'] = this.addressinfo;
    orderobj['delivery_date'] = this.selectedeliverydate;
    orderobj['delivery_time'] = this.selectedeliverytime;

    orderobj['amount_to_pay'] = this.getTotal();
    orderobj['savingAmount'] = this.getMySavings();    
    orderobj['shipping_charge'] = this.getDeliveryCharge();    
    orderobj['payableAmount'] = this.getPayableAmount();
    orderobj['email'] = localStorage.getItem('email');
    
    orderobj['couponCode'] = this.appliedCouponCode;
    orderobj['payment_mode'] = this.checkedIdx; 
    orderobj['paid'] = 0;           
    console.log(orderobj);
    if(this.checkedIdx == 4)
    {
      // alert(orderobj['paid'] + ' ' + orderobj['payment_mode']);
      // this.presentOnlinePaymentAlert();
      var options = {
        description: 'Grostep Online Payment',
        //image: 'https://newhealthyfieapi.herokuapp.com/products/image/applogo.png',
        currency: 'INR',
        key: 'rzp_live_XOuWvRagM3E5Ab',
        amount: orderobj['payableAmount'] * 100,
        name: localStorage.getItem('name'),
        prefill: {
          email: localStorage.getItem('email'),
          contact: localStorage.getItem('phoneNumber'),
          name: localStorage.getItem('name'),
        },
        theme: {
          color: '#84c225'
        },
        modal: {
          ondismiss: () => { // <- Here!
            //alert('dismissed')
          }
        }
      };
      
    var successCallback = (success) => { // <- Here!
      var orderId = success.razorpay_order_id
      var signature = success.razorpay_signature
      orderobj['razorpay_payment_id'] = success.razorpay_payment_id;
      orderobj['razorpay_order_id'] = orderId;
      orderobj['razorpay_signature'] = signature;
      orderobj['paid'] = 1;   
      // alert(orderobj['paid'] + ' ' + orderobj['payment_mode']);
      this.createLoader();
      this.loading.present().then(() => {
        this.orderService.postorder(orderobj).subscribe(response => {      
          if(response.json().statusCode == "200")
          {
            this.loading.dismiss().then( ()=>{
              this.cartService.removeAllCartItems();
              this.addressService.emptyDeliveryInfo();            
              this.navCtrl.push(SuccessPage,{order_id:response.json().orderId});
            })
          }
        });
      });
    };
          
    var cancelCallback = (error) => { // <- Here!
      //alert(error.description + ' (Error ' + error.code + ')');
    };
    
    this.platform.ready().then(() => {
      // RazorpayCheckout.open(options, successCallback, cancelCallback);
    })      
    }
    else
    {
      this.createLoader();
      this.loading.present().then(() => {
        this.orderService.postorder(orderobj).subscribe(response => {
          console.log(response.json());
          if(response.json().statusCode == "200")
          {
            this.loading.dismiss().then( ()=>{
              this.cartService.removeAllCartItems();
              this.addressService.emptyDeliveryInfo();            
              this.navCtrl.push(SuccessPage,{order_id:response.json().orderId});
            })
          }
        });
      });
    }          
  }

  ionViewDidLoad() {    
    // this.events.subscribe('success',() => {
    //   console.log('successs11111')
    //   this.navCtrl.setRoot(SegmentPage);          
    //  });   
    // if(this.cartService.checkEmptyCart())
    // {
    //   this.navCtrl.setRoot(SegmentPage);  
    // }
  }

}
