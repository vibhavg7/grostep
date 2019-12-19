import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, 
  Loading,MenuController,Platform,ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
// import { Facebook } from '@ionic-native/facebook';
// import { NativeStorage } from '@ionic-native/native-storage';
// import { SegmentPage } from '../segment/segment';
import { HomePage } from '../home/home';
import { ForgetpasswordPage } from '../forgetpassword/forgetpassword';
import { CartPage } from '../cart/cart';
import { RegistrationPage } from '../registration/registration';
import { SelectDeliveryPage } from '../select-delivery/select-delivery';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// s
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading:Loading;
  registerCredentials = { email: '', password: '' };
  createSuccess = false;
  FB_APP_ID: number = 1555216251254067;
  PrevPage : any;
  loginForm : any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(public navCtrl: NavController, private auth: AuthService, public menu : MenuController,
    public navParams: NavParams,private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public fbuilder: FormBuilder,
    // public fb: Facebook,
    private platform : Platform,
    private network:Network,private toastCtrl: ToastController)
    //,public nativeStorage: NativeStorage,
  {    
      //this.fb.browserInit(this.FB_APP_ID, "v2`.8");    
      this.loginForm = fbuilder.group({                
        'email' : [null,Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],        
        'password' : [null, Validators.compose([Validators.required])],      
      })

      if(navParams.get('PrevPage')==undefined) 
        this.PrevPage = 'RegistrationPage' ; 
      else 
        this.PrevPage = navParams.get('PrevPage');
  }

  ionViewWillEnter()
  {
   
  }
  
  public createAccount()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.showLoading();   
        this.navCtrl.push(RegistrationPage,{PrevPage:this.PrevPage});
      }
    });
  }

  public forgetPassword()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.showLoading();
        this.navCtrl.push(ForgetpasswordPage);
      }
    });    
  }


  public login() {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        if(!this.loading){
          this.loading = this.loadingCtrl.create({
              content: 'Please Wait...'
          });
          this.loading.present();
        }
        if(this.registerCredentials.email !="" && this.registerCredentials.password !="")
        {
          this.auth.login(this.registerCredentials).subscribe(allowed => {            
            if (allowed) 
            {
              this.loading.dismiss();
              if(this.PrevPage!=null && this.PrevPage =='CartPage')
              {
                this.navCtrl.push(CartPage)
                .then(() => {
                  const startIndex = this.navCtrl.getActive().index - 2;
                  this.navCtrl.remove(startIndex, 2);
                });
              }
              else
              {                
                this.navCtrl.setRoot(HomePage);                
              }            
            }
            else
            {              
              this.showError("Invalid email or password");              
            }
          });
        }
        else
        {          
          this.showError("Please enter email or password");
        }                        
      }
    });
  }

  doFbLogin(){
    // this.platform.ready().then(() => {
    //   if(this.network.type == "none")      
    //     alert('No Internet Connection Found');
    //   else
    //   {
    //     let permissions = new Array<string>();
    //     let nav = this.navCtrl;            
    //     permissions = ["public_profile","email"];
    
    //     this.fb.login(permissions)
    //     .then((response) => {
    //       let userId = response.authResponse.userID;
    //       let params = new Array();              
    //       this.fb.api("/me?fields=name,gender,email", params)          
    //       .then((user) => {
    //         //alert(JSON.stringify(user))
    //         // Get the connected user details
    //         var fblogindetails = {};            
    //         fblogindetails['gender'] = user.gender;            
    //         fblogindetails['name'] = user.name;
    //         fblogindetails['email'] = user.email;
    //         fblogindetails['picture'] = "https://graph.facebook.com/" + userId + "/picture?type=large";
    //         fblogindetails['loginMethod'] ="2";
    //         fblogindetails['password'] = "12345";
    //         //alert(JSON.stringify(fblogindetails));
    //         this.auth.dofbRegister(fblogindetails).subscribe(success => {    
    //           if (success) {            
    //             if(this.PrevPage!=null && this.PrevPage =='CartPage')
    //             {
    //               this.navCtrl.push(CartPage, {status:"1"})
    //               .then(() => {
    //                 const startIndex = this.navCtrl.getActive().index - 2;
    //                 this.navCtrl.remove(startIndex, 2);
    //               });
    //             }
    //             else
    //               this.navCtrl.setRoot(HomePage);
    
    //           } 
    //           else 
    //             this.showPopup("Error", "Problem creating account.");
              
    //           })
    //       })
    //     }, (error) => {
    //       this.showPopup("Error", JSON.stringify(error));
    //     });
    //   }
    // });    
  }

  // doGoogleLogin(){
  //   let nav = this.navCtrl;
  //   let env = this;
  //   let loading = this.loadingCtrl.create({
  //     content: 'Please wait...'
  //   });
  //   loading.present();
  //   this.googlePlus.login({      
  //     'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
  //     'webClientId': '1037947845487-7v5d0b53fdtjpqcc6ircel2na0dev8ec.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
  //     'offline': true
  //   })
  //   .then(function (user) {
  //     loading.dismiss();
  //     user.name = user.displayName;
  //     user.picture = user.imageUrl;
  //     user.loginMethod ="3";
  //     //this.navCtrl.setRoot(SegmentPage);
  //     this.auth.dogoogleRegister(user).subscribe(success => {    
  //         if (success) {            
  //           this.navCtrl.setRoot(SegmentPage);
  //         } else {
  //           this.showPopup("Error", "Problem creating account.");
  //         }
  //       })          
  //   }, function (error) {
  //     loading.dismiss();
  //   });
  // }

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

  ionViewWillLeave() 
  {
    
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
   // this.loading.present();
  }


  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 200,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}