import { Component,Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams,Alert,AlertController,LoadingController, 
         Loading,ToastController,Events,Platform  } from 'ionic-angular';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { VoucherService } from '../../providers/voucher-service/voucher-service';
import { SelectDeliveryPage } from '../select-delivery/select-delivery';
import { LoginPage } from '../login/login';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { SegmentPage } from '../segment/segment';
// import { SearchProductsPage } from '../search-products/search-products';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {  
  nav : NavController;
  cartList : Array<CartItem>;
  loading: Loading;
  totalAmount : any;
  deliveryCharge : number;
  payableAmount : any;
  couponCode : string;
  voucherData : any;
  voucherApplied : boolean;
  discountedValue : number;
  cartCategories: Array<String> = [];
  //private networkService:NetworkService,
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,private auth: AuthService, 
              public voucherService : VoucherService, private events: Events, 
              public navParams: NavParams, 
              private cartService : CartService,private platform : Platform,
              private loadingCtrl: LoadingController,private toastCtrl: ToastController,
              private network : Network ) 
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

ionViewDidEnter()
{

}

  ionViewWillEnter()
  {    
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
          content: 'Please Wait...'
      });
      this.loading.present();
    }
    
    this.cartList = this.cartService.getAllCartItems();
    console.log(this.cartList);
    for(var i = 0; i< this.cartList.length; i++)
    {
     if(this.cartCategories != null && this.cartCategories != undefined &&
             this.cartCategories.indexOf(this.cartList[i].main_category_name) > -1)
        continue;
      this.cartCategories.push(this.cartList[i].main_category_name)
    }
    this.deliveryCharge = 0;
    this.hideLoading();
  }

  private compare(a,b) {
    if (a.main_category_name < b.main_category_name)
      return -1;
    if (a.main_category_name > b.main_category_name)
      return 1;
    return 0;
  }

  ionViewWillLeave() {

  }
  
  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  searchproducts()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        // this.navCtrl.push(SearchProductsPage);
      }
    });      
  }


  removeItemFromCart(item){
    //console.log(item);
    var counter = 0;
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        let confirm = this.alertCtrl.create({
          title: 'Confirm Delete',
          subTitle: 'Are you sure you want to delete this item from cart?',
          // cssClass: 'alertDanger',
          buttons: [
            {
              text: 'Cancel',
              cssClass:'cancelcss',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Remove',
              cssClass:'removecss',
              handler: () => {
                console.log('Remove clicked');
                this.cartList.forEach(cartitem =>{
                        if(cartitem.main_category_name == item.main_category_name)
                        {
                          counter++;
                        }
                          
                })
                if(counter == 1)
                {
                  var index = this.cartCategories.indexOf(item.main_category_name);    // <-- Not supported in <IE9
                  if (index !== -1) {
                    this.cartCategories.splice(index, 1);
                  }
                }
                this.cartService.removeItemById(item._id);
                this.cartList = this.cartService.getAllCartItems();
                //this.presentToast('Product deleted from cart');
              }
            }
          ]
        });
        confirm.present();
      }
    });
}

checkout(){
  this.platform.ready().then(() => {
    if(this.network.type == "none")      
      alert('No Internet Connection Found');
    else
    {
          if(this.auth.isauthenticated == null || this.auth.isauthenticated == '' )
          {            
            this.navCtrl.push(LoginPage,{PrevPage:"CartPage"});            
          }
          else
          {           
            this.navCtrl.push(SelectDeliveryPage);
          }     
    }
    })



}

getTotal(): number{
  this.totalAmount = this.cartService.getGrandTotal();  
  return this.cartService.getGrandTotal();
}

getDeliveryCharge() : number
{
  return this.cartService.getDeliveryCharge(); 
}

getMySavings() : number
{
  if(!this.voucherApplied)
    return this.discountedValue = 0;
  return this.discountedValue;
}

getPayableAmount()
{
  if(!this.voucherApplied)
    return this.totalAmount  + this.getDeliveryCharge();
  return this.payableAmount;
}

quantityPlus(item){
  this.platform.ready().then(() => {
    if(this.network.type == "none")      
      alert('No Internet Connection Found');
    else
    {
      this.cartService.quantityPlus(item);
      //this.presentToast('Product updated to cart');
    }
  });    
}

quantityMinus(item){
  this.platform.ready().then(() => {
    if(this.network.type == "none")      
      alert('No Internet Connection Found');
    else
    {
      if(item.quantity > 1){
        this.cartService.quantityMinus(item);
        //this.presentToast('Product updated to cart');
      } 
      else 
      {
        let confirm  = this.alertCtrl.create({
              // title: 'Cart Error',
              subTitle: "You can't reduce the quantity below 1. If you want to remove, please press remove button.",
              buttons: ['Ok']
          });
          confirm.present();
      }
    }
  });  
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
applyCouponCode()
{
   this.voucherService.applyVoucherCode(this.couponCode)
   .subscribe(voucherData => {
     this.voucherData = voucherData;
     this.couponCode = '';     
     console.log(this.voucherData);

     if(this.voucherData.success)
     {
      this.voucherApplied = true;        
      this.discountedValue = this.totalAmount * (this.voucherData.voucherdata.savingPercentage/100);
      this.payableAmount = this.totalAmount - this.discountedValue   + this.deliveryCharge;
      this.presentToast('Coupon Code Applied');
     }
     else
      this.presentToast('Coupon Code Invalid');
   })
}

removeVoucher()
{
  this.voucherApplied = false;  
  this.discountedValue = 0;
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
    console.log('Dismissed toast');
  });

  toast.present();
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

}
