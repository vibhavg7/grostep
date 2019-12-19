import { Component } from '@angular/core';
import { NavController, NavParams,Platform,ToastController,AlertController,LoadingController } from 'ionic-angular';
import {ProductService } from '../../providers/product-service/product-service';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import { Network } from '@ionic-native/network';
// import { SearchProductsPage } from '../search-products/search-products';
import { CartPage } from '../cart/cart';
import { BlankPage } from '../blank/blank';
import {Product} from '../../models/product';

/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  loading : any;
  product_id : any;
  productinfo : any;
  cartList : Array<CartItem>;
  product : Product;
  cartproductQuantity : number = 0;
  savingPercentage : number;
  selectedQuantityFruits : any;
  weight : any;
  getGrandTotal : number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public productService : ProductService,public platform : Platform,
              public network : Network,public cartService: CartService,private loadingCtrl : LoadingController,
              private toastCtrl: ToastController,public alertCtrl: AlertController,)
   {
    if(navParams.get('product_id')==undefined) 
      this.product_id = '' ; 
    else 
      this.product_id = navParams.get('product_id'); 
      // console.log(this.product_id);
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
            this.navCtrl.setRoot(BlankPage);
          }
          else
          { 
            this.cartList = this.cartService.getAllCartItems();
            // this.productService.getproductdetail(this.product_id,"products");
            this.productService.getproductdetail(this.product_id,"products").subscribe(details =>{
            this.product = details;
            this.product.selected_weight = this.product.orignal_weight;
            // console.log(this.product);      
            // this.selectedQuantityFruits = details.quantity_available[0];      
            // this.cartproductQuantity = this.cartService.getcartproductQuantity(this.product);
            this.product.savingPercentage = ((this.product.market_price - this.product.our_price)/ this.product.market_price)*100;         
            this.loading.dismiss();
          })}
        });
    });    
  }

  onchange(productweight,product) 
  {                
    this.weight = parseInt(productweight.split(" ")[0]);
    product.our_price = (this.weight)/(parseInt(product.orignal_weight)) * product.orignal_our_price; 
    product.market_price = (this.weight)/(parseInt(product.orignal_weight)) * product.orignal_market_price;    
    product.selected_weight = this.weight;
    product.quantity_added = 1;
    product.added = false;
    // console.log(productweight);
    // console.log(product);
  }


  // getproductquantity() : number
  // {
  //   console.log(this.cartproductQuantity)
  //   return this.cartproductQuantity;
  // }
  viewCart()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.push(CartPage);
      }
    });            
  }

  addbutton(product : Product)
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        // this.cartService.addItem(product, 1);
        // // this.presentToast('Product updated to cart');                 
        // product.added = true;
        // if(product.quantity_added == null || 
        //     product.quantity_added == undefined || product.quantity_added == 0)
        // {
        //   product.quantity_added = 1;           
        //   this.cartproductQuantity = 1;          
        // }        
        this.cartService.addItem(product, 1);
        // this.presentToast('Product updated to cart');    
        this.getGrandTotal =  this.cartService.getGrandTotal(); 
          
        this.product.added = true;
  
        if(this.product.quantity_added == null || 
            this.product.quantity_added == undefined || 
            this.product.quantity_added == 0)
          this.product.quantity_added = 1;      
      }      
    });  
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

  addtocart(product:Product)
  {    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.cartproductQuantity += 1;
        product.quantity_added += 1;
        this.cartService.addItem(product, 1);
        // this.presentToast('Product updated to cart');            
      }
    });          
  }

  removeItemfromCart(product : Product)
  {
 
    // this.platform.ready().then(() => {
    //   if(this.network.type == "none")      
    //     alert('No Internet Connection Found');
    //   else
    //   {         
    //     if(this.cartproductQuantity >= 1)
    //     {
    //       this.cartproductQuantity -= 1;
    //       product.quantity_added -= 1;     
          
    //       this.cartService.removeItem(product, 1);
    //       // this.presentToast('Product updated to cart');        
    //     }        
    //   }
    // });      
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {        
        this.product.quantity_added -= 1;      
        if(this.product.quantity_added > 0)
        {
          this.cartService.removeItem(product, 1);
          //this.presentToast('Product updated to cart');
          this.getGrandTotal =  this.cartService.getGrandTotal(); 
        }
        else if(this.product.quantity_added == 0)
        {
          this.product.added = false;
          this.cartService.removeItem(product, 1);
          //this.presentToast('Product updated to cart');
          this.getGrandTotal =  this.cartService.getGrandTotal(); 
        }
        else if(this.product.quantity_added < 0)
        { 
          let confirm  = this.alertCtrl.create({
                // title: 'Cart Error',
                subTitle: "Quantity is 1, you can't reduce it.",
                buttons: ['Ok']
            });
          confirm.present();
        }
      }
    });  
    
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 200,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      
    });
  
    toast.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

}
