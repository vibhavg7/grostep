import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, 
         Platform,Loading, App } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user';
import { LoginPage } from '../../pages/login/login';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
import { SegmentPage } from '../segment/segment';
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../change-password/change-password';
import { ForgetpasswordPage} from '../forgetpassword/forgetpassword';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { MyordersPage } from '../../pages/myorders/myorders';
import { MyCouponsPage } from '../../pages/my-coupons/my-coupons';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user : User;
  loading: Loading;
  private NAME_KEY = "name";
  private TOKEN_KEY = "token";
  constructor(public navCtrl: NavController, private auth: AuthService, public navParams: NavParams,
              private alertCtrl: AlertController, private loadingCtrl: LoadingController,
              public _app : App,private platform:Platform,private network:Network) 
  {
    
  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
      {
        alert('No Internet Connection Found');
        this.navCtrl.setRoot(BlankPage);
      }
      else
      {
        if(localStorage.getItem('token') != null)
        {
            if(!this.loading){
              this.loading = this.loadingCtrl.create({
                  content: 'Please Wait...'
              });
              this.loading.present();
            }
            this.auth.getUserProfile().subscribe(userinfo => {
              this.user = userinfo;
              this.hideLoading();
              // console.log(this.user);
            })
        }
      }
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  logout()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.auth.logout();    
        this.navCtrl.setRoot('HomePage');    
      }
    });    
  }

  getAddress()
  {    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.push(DeliveryAddressPage,{PrevPage:"profile"});
      }
    });    
  }
  
  changePassword()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.push(ChangePasswordPage);
      }
    });  
    
  }

  myOrder()
  {
    this.navCtrl.push(MyordersPage);    
  }
  
  myCoupons()
  {
    this.navCtrl.push(MyCouponsPage,{PrevPage:"profile"});
  }
  forgetPassword()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.push(ForgetpasswordPage);
      }
    });  
    
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProfilePage');
  }
}
