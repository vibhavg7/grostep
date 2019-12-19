import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Platform,
  LoadingController, Loading,ToastController } from 'ionic-angular';
import { VoucherService } from '../../providers/voucher-service/voucher-service';
import{CartItem,CartService} from '../../providers/cart-service/cart-service';
import { Voucher } from '../../models/voucher';
import { Uservoucher } from '../../models/uservoucher';
import { SegmentPage } from '../../pages/segment/segment';
import { Network } from '@ionic-native/network';
import { PaymentPage} from '../payment/payment';
import { PaymentOptionPage } from '../payment-option/payment-option';
/**
 * Generated class for the MyCouponsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-coupons',
  templateUrl: 'my-coupons.html',
})
export class MyCouponsPage {

  voucherList : Voucher[];
  uservoucher = {tokenId :'', voucherId :'' ,status :'',processed:'',voucherPercentage:0 };
  grandTotal : number;
  enableApplyButton : boolean;
  enableBuyMoreButton : boolean;
  createSuccess = false;
  deliveryCharge : number = 0;
  loading : Loading;
  totalAmount : number;
  voucherData : any;
  discountedValue : number;
  payableAmount :number;
  PrevPage : any;
  buttonvisible : boolean = true;
  constructor(public navCtrl: NavController, private voucherService: VoucherService,
    public cartService : CartService,public navParams: NavParams,private platform : Platform,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    private network : Network,private toastCtrl : ToastController) 
  {
      
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  getTotal(): number{
    this.totalAmount = this.cartService.getGrandTotal();  
    return this.totalAmount;
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

  applyCouponCode(couponCode)
  {    
    var obj = {"tokenId":localStorage.getItem("token"),"couponCode":couponCode,"orderAmount":this.getTotal() };
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
        if(this.voucherData.voucherinfo[0].CalculateByPercentage)
          this.discountedValue = this.getTotal() * (this.voucherData.voucherinfo[0].savingPercentage/100);          
        else
          this.discountedValue = this.voucherData.voucherinfo[0].couponValue;
        console.log(this.discountedValue);
        //this.payableAmount = this.getTotal() - this.discountedValue   + this.deliveryCharge; 
        this.presentToast('Coupon Code Applied');
        this.navCtrl.push(PaymentOptionPage, {voucherApplied:true,discountedValue:this.discountedValue,
          // payableAmount:this.payableAmount,
          deliveryCharge : this.deliveryCharge,
          codeName: couponCode})
        .then(() => {
          const startIndex = this.navCtrl.getActive().index - 2;
          this.navCtrl.remove(startIndex, 2);
        });        
      }
    })
  }

  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {     
          this.PrevPage = this.navParams.get('PrevPage');        
          if(this.PrevPage != undefined && this.PrevPage =="profile")
          {
             this.buttonvisible = false;
          }
          this.createLoader();
          this.loading.present().then(() => {
            this.voucherService.getAllVoucher().subscribe(voucherinfo => {
              this.loading.dismiss();
              // console.log(voucherinfo);
              this.voucherList = voucherinfo;              
            }, error => {
              this.loading.dismiss();               
            })
          })
      }
    })

    //this.voucherService.getAllVoucher().subscribe(voucherinfo => {
      
      //this.grandTotal = navParams.get('grandTotal');
      //this.deliveryCharge = navParams.get('deliveryCharge');
      
      // if(this.grandTotal > 100)
      // {
      //   //console.log(this.grandTotal+"C");
      //   this.enableApplyButton = true;
      //   this.enableBuyMoreButton = false;
      // }
      // else
      // {
      //   //console.log(this.grandTotal+"N");
      //   this.enableApplyButton = false;
      //   this.enableBuyMoreButton = true;
      // }
     // this.voucherList = voucherinfo;
    // })
  }
  applyCoupon(voucher : Voucher)
  {
     this.uservoucher.tokenId = localStorage.getItem("token");
     this.uservoucher.voucherId  = voucher._id;
     this.uservoucher.status = '1';
     this.uservoucher.processed = '1';
     this.uservoucher.voucherPercentage = voucher.savingPercentage;
     
      this.voucherService.applyVoucher(this.uservoucher).subscribe(voucherinfo => {
     
       if (voucherinfo.voucher.status=="1") {
         this.createSuccess = true;
         this.navCtrl.push(PaymentOptionPage, {voucherApplied:true,
                           deliveryCharge: this.deliveryCharge,
                           grandTotal:this.grandTotal,
                           voucherPercentage: voucherinfo.voucher.voucherPercentage});
       } 
       else 
       {
         this.showPopup("Error", "Problem creating account.");
       }
     },
       error => {
         this.showPopup("Error", error);
        });
  }

  buyMore()
  {
    this.navCtrl.setRoot(SegmentPage, {}, {animate: true, direction: 'forward'});
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoucherPage');
  }

  payment()
  {
    this.navCtrl.push(PaymentPage);
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
}
