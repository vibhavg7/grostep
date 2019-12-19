import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, Platform, 
        Loading,ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user';
import { LoginPage } from '../../pages/login/login';
import { VerifypasswordPage } from '../verifypassword/verifypassword';
// import { SMS } from '@ionic-native/sms';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the ForgetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {
 
  email : string;
  loading: Loading;  
  forgetPwdForm : any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(public navCtrl: NavController, private auth: AuthService, public navParams: NavParams,
              private alertCtrl: AlertController, private loadingCtrl: LoadingController,
              private toastCtrl : ToastController,private platform:Platform,public fb: FormBuilder,
              private network : Network) {
                //private smsVar: SMS,
                this.forgetPwdForm = fb.group({                                    
                  'email' : [null,Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],                  
                })
  }

  ionViewWillEnter()
  {    
 
  }

  sendOTP()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.showLoading();
        this.auth.sendOTP(this.email).subscribe(res =>{
          this.hideLoading();
            if(res.success)
            {            
              this.presentToast('Please enter the OTP');
              this.navCtrl.push(VerifypasswordPage,{otp : res.oTP,createddate:res.createddate,email:this.email});
            }
            else
            {
              this.presentToast('Invalid email id');
            }
        })
      }
    });
  }

  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }


  // sendTextMessage(message : string,phoneNumber : number) {
  //   var options={
  //     replaceLineBreaks: false, // true to replace \n by a new line, false by default
  //     android: {
  //          //intent: 'INTENT'  // Opens Default sms app
  //         intent: '' // Sends sms without opening default sms app
  //       }
  //   }
  //   //SMS.send(this.text.number, this.text.message);
  //   // this.smsVar.send(phoneNumber.toString(), message,options)
  //   // .then(()=>{
  //   //   alert("Message send succesfully. PLease check");
  //   // },()=>{
  //   //   alert("Message failed due to some technical reasons.");
  //   // });
  //   console.log(message + "---" + phoneNumber.toString());
  // }

  // update()
  // {
  //   if(this.randomNumber == +this.text.number)
  //   {
  //     this.auth.changePwd(this.text.npwd).subscribe(response => {
  //       console.log(response);
  //        if (response.status) 
  //        {
  //          this.createSuccess = true;
  //          this.showPopup("Success", "Password successfully changed.");
  //          this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'forward'});
  //        }
  //        else {
  //          this.showPopup("Error", "Problem changing password.");
  //        }
  //      },
  //        error => {
  //          this.showPopup("Error", error);
  //        });
  //   }
  //   else
  //   {
  //     alert("OTP is wrong entered.Please check");
  //   }
    
  // }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 500,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetpasswordPage');
  }

}
