import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, 
  Loading,ToastController,Platform,Events  } from 'ionic-angular';
import { ProductService } from '../../providers/product-service/product-service';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import {Product} from '../../models/product';
import { CartPage } from '../cart/cart';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
// import { SearchProductsPage } from '../search-products/search-products';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
// import { CurrentLocationPage } from '../current-location/current-location';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-segment',
  templateUrl: 'segment.html',
})

export class SegmentPage {
  product_items: string = "";
  loading: Loading;
  currentLocation : any;
  products : Product[];
  fruitproducts : Product[];
  vegetableproducts : Product[];
  dairyproducts : Product[];
  dailyproducts : Product[];
  fruitscomboproducts : Product[];
  vegetablescomboproducts : Product[];
  mixedcomboproducts : Product[];
  gymproducts : Product[];
  kitchenproducts : Product[];
  categories : any;
  createSuccess = false;  
  intvalue : number;
  cartList : Array<CartItem>;
  getGrandTotal : number;  
  selectedQuantityFruits : any = '';
  selectedQuantityVegetables : any = '';
  selectedQuantityDairy : any = '';
  selectedQuantityFruitsCombo : any = '';
  selectedQuantityVeggiesCombo : any = '';
  selectedQuantityMixedCombo : any = '';
  weight : any;
  addbuttondisable : boolean;
  online : boolean = false;
  category_id: any;
  
  constructor(public navCtrl: NavController,public navParams: NavParams,public alertCtrl: AlertController,
                private events: Events,private productservice: ProductService, 
                private cartService : CartService,private network: Network, 
                private loadingCtrl: LoadingController,
                private auth: AuthService,
                private toastCtrl: ToastController,private platform: Platform) 
  {        
    this.navCtrl = navCtrl;    
    this.intvalue =1;       
  }

 

  
  ionViewWillEnter()
  {   
    //this.getProductCategories()
    //this.getProductsData(); 
    this.currentLocation = localStorage.getItem("currentlocation");
    this.category_id = this.navParams.get('category_id');      
    if(this.category_id != null)
      this.getProductsData(this.category_id)
    // else
    //   this.getProductsData(0)  
  }

  ionViewDidEnter()
  {    
   
  }

  onselectedQuantityChange()
  {
    
  }

  addressChange()
  {

    this.auth.hasLoggedIn().then((hasLoggedIn) => {      
        if(hasLoggedIn === true)
        {
          this.navCtrl.push(DeliveryAddressPage,{PrevPage:"segmentPage"});
        }
        else
        {
          // this.navCtrl.push(CurrentLocationPage);
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
  
  // getProductCategories()
  // {
  //   this.platform.ready().then(() => {
      
  //     this.loading = this.loadingCtrl.create({
  //       content: 'Please Wait..'
  //     });

  //      this.loading.present().then( () =>{          
  //         if(this.network.type == "none")      
  //         {        
  //           this.loading.dismiss();            
  //           alert('No Internet Connection Found');
  //           this.navCtrl.setRoot(BlankPage);
  //         }
  //         else
  //         {       
  //           this.getProductsData(0);        
  //           this.loading.dismiss();     
  //             // this.productservice.getAllMainCategory().subscribe(categories =>{
                
  //             //   categories.sort(function(a,b) {return (a._id.product_type > b._id.product_type) ? 1 : ((b._id.product_type > a._id.product_type) ? -1 : 0);} ); 
  //             //     this.categories = categories;
  //             //     this.getProductsData(categories[0]._id.product_type);                  
  //             //     this.loading.dismiss();                
  //             // }, error => {
  //             //   this.loading.dismiss();               
  //             // })      
  //         }
  //   });            
  //    }); 
  // }
  // getProductsData1()
  // {
  //   console.log('1111');
  //   console.log(this.product_items);
  // }

  getProductsData(id)
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
            if(id == 0)
            {
              // this.productservice.getAllProducts().subscribe(res=>{                
              //   this.products = res.products;                
              //   if(res.categories.length >0)
              //     this.categories = res.categories;                
              //   this.categories.sort(function(a,b) {return (a.category_id > b.category_id) ? 1 : ((b.category_id > a.category_id) ? -1 : 0);} ); 
              //   // this.categories = output;
              //   this.products.forEach(prod =>
              //   {
              //     prod.savingPercentage =  (prod.market_price - prod.our_price)/prod.market_price * 100;
              //     prod.selected_weight = prod.orignal_weight
              //   });
              //   console.log(this.products);
              //   this.cartList = this.cartService.getAllCartItems();    
              //   this.getGrandTotal =  this.cartService.getGrandTotal();
              //   this.loading.dismiss();
              // }, error => {
              // this.loading.dismiss();               
              // })  
            }
            else
            {
                console.log('-------' + id);
                this.productservice.getProductByCategoryId(id,"products/category").subscribe(res => {
                  console.log(res);
                  this.products = res.products;
                  console.log(this.categories);
                  if(res.categories.length >0)
                    this.categories = res.categories;
                  // var flags = [], output = [], l = res.categories.length, i;
                  // for( i=0; i<l; i++) {
                  //     if( flags[res.categories1[i].product_type]) continue;
                  //     flags[res.categories1[i].product_type] = true;
                  //     output.push(res.categories1[i]);
                  // }
                  if(this.categories != null) this.categories.sort(function(a,b) {return (a.category_id > b.category_id) ? 1 : ((b.category_id > a.category_id) ? -1 : 0);} ); 
                  // this.categories = output;
                  this.products.forEach(prod =>
                  {
                    prod.savingPercentage =  (prod.market_price - prod.our_price)/prod.market_price * 100;
                    prod.selected_weight = prod.orignal_weight
                  });
                  this.cartList = this.cartService.getAllCartItems();    
                  this.getGrandTotal =  this.cartService.getGrandTotal();
                  this.loading.dismiss();
                }, error => {
                this.loading.dismiss();               
                })    
            }
            
          }
    });            
    }); 
  }
       
  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
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


  searchedProduct(product)
  {
    console.log(product._id);
    this.navCtrl.push(ProductDetailPage,{product_id:product._id}); 
  }


  addbutton(product:Product)
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        console.log(product);
        this.cartService.addItem(product, 1);
        // this.presentToast('Product updated to cart');    
        this.getGrandTotal =  this.cartService.getGrandTotal(); 
  
        let itemIndex = this.products.findIndex(item => item._id == product._id);     
        this.products[itemIndex].added = true;
  
        if(this.products[itemIndex].quantity_added == null || 
            this.products[itemIndex].quantity_added == undefined || 
            this.products[itemIndex].quantity_added == 0)
          this.products[itemIndex].quantity_added = 1;      
     
      }      
  });  
  //this.cartService.addItem(product, 1,this.weight);    
  }


  addtocart(product : Product)
  {    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        let itemIndex = this.products.findIndex(item => item._id == product._id);
        this.products[itemIndex].quantity_added += 1;
        this.cartService.addItem(product, 1);
        //this.cartService.addItem(product, 1,this.weight);
        //this.presentToast('Product updated to cart');    
        this.getGrandTotal =  this.cartService.getGrandTotal(); 
      }
    });          
  }

  removeItemfromCart(product : Product)
  {
 
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        let itemIndex = this.products.findIndex(item => item._id == product._id);      
        this.products[itemIndex].quantity_added -= 1;      
        if(this.products[itemIndex].quantity_added > 0)
        {
          this.cartService.removeItem(product, 1);
          //this.presentToast('Product updated to cart');
          this.getGrandTotal =  this.cartService.getGrandTotal(); 
        }
        else if(this.products[itemIndex].quantity_added == 0)
        {
          this.products[itemIndex].added = false;
          this.cartService.removeItem(product, 1);
          //this.presentToast('Product updated to cart');
          this.getGrandTotal =  this.cartService.getGrandTotal(); 
        }
        else if(this.products[itemIndex].quantity_added < 0)
        { 
          let confirm  = this.alertCtrl.create({
                title: 'Cart Error',
                subTitle: "Quantity is 1, you can't reduce it.",
                buttons: ['Ok']
            });
          confirm.present();
        }
      }
    });        
  }
  
  // viewCart()
  // {
  //   this.platform.ready().then(() => {
  //     this.loading = this.loadingCtrl.create({
  //       content: 'Please Wait..'
  //     });
  //   this.loading.present().then( () =>{     
  //     if(this.network.type == "none")      
  //       alert('No Internet Connection Found');
  //     else
  //     {          
  //       this.cartService.saveAllItemsInCart().subscribe(res=>{
  //         this.loading.dismiss();
  //         if(res.json().statusCode == '200')
  //         {
  //           this.navCtrl.push(CartPage);
  //         }
  //         else
  //         {
  //           alert('No Internet Connection Found');
  //         }
  //       })        
  //     }
  //   })    
      
  //   });            
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

  showLoading() 
  {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
   // this.loading.present();
  }
  
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 500,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      
    });
  
    toast.present();
  }

  ionViewWillLeave()
  {
    this.events.unsubscribe('network:offline');
    this.events.unsubscribe('network:online');    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SegmentPage');
  }

}
