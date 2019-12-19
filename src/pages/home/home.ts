import { Component } from '@angular/core';
import { NavController, Platform,LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { SegmentPage } from '../../pages/segment/segment';
import { ProductService } from '../../providers/product-service/product-service';
import { BannerServiceProvider } from '../../providers/banner-service/banner-service';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';
import { CartPage } from '../cart/cart';
// import { SearchProductsPage } from '../search-products/search-products';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading : any;
  categories : any;
  cartList : Array<CartItem>;
  loaded : boolean = false;
  mainPageLoader: boolean = true;
  banners : any;
  bannerLoader: boolean = false;
  constructor(public navCtrl: NavController,private platform : Platform,
              public network : Network,
              private productservice: ProductService,
              private bannerService : BannerServiceProvider,
              private cartService : CartService, 
              private loadingCtrl : LoadingController) {

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
              this.bannerService.getAllBanners().subscribe(banners =>{                                                                            
                this.banners = banners;
                this.bannerLoader = true;
                console.log(this.banners);
                this.loading.dismiss();                
              }, error => {
                this.loading.dismiss();               
              });

                this.productservice.getAllMainCategory().subscribe(categories =>{                                                                            
                  this.cartList = this.cartService.getAllCartItems();                        
                  this.categories = categories;                                
                  //this.mainPageLoader = true;                   
                }, error => {
                  this.loading.dismiss();               
                });
                                
            }
      });            
      }); 
  }

  setDefaultPic(event)
  {
    event.target.src = "assets/imgs/fruit_vegetable_alt_image.png";
    event.target.className = "defaultbanner";
    
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

  dosomething()
  {
    this.loaded = true;    
  }

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

  searchProductsByCategory(category)
  {
    console.log(category.category_id);
    this.navCtrl.push(SegmentPage,{category_id:category.category_id})
  }
}
