import { Component } from '@angular/core';
import {NavController, NavParams,AlertController, Platform,
        LoadingController, Loading ,ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user';
import { SegmentPage } from '../../pages/segment/segment';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation } from './../../validator/PasswordValidation';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  createSuccess = false;  
  //changepasswordCredentials = { opwd:'', password: '', confirmPassword: ''};
  changepasswordCredentials = { password: '', confirmPassword: ''};
  changePasswordForm : FormGroup;
  constructor(public navCtrl: NavController, private auth: AuthService,private platform :Platform,
    public navParams: NavParams,private alertCtrl: AlertController, private network : Network,
    public fb: FormBuilder,
    private loadingCtrl: LoadingController , private toastCtrl : ToastController ) {

      this.changePasswordForm = fb.group({
        'password' : ['', Validators.compose([Validators.required, Validators.minLength(8)])],      
        'confirmPassword' : ['', Validators.compose([Validators.required, Validators.minLength(8)])]
      }, {
        validator: PasswordValidation.MatchPassword // your validation method
      })
  }
  changePwd()
  {   
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.auth.changePwd(this.changepasswordCredentials).subscribe(response => {     
          if (response.status) 
          {
            this.createSuccess = true;
            this.presentToast('Password changed successfully.');
            this.navCtrl.setRoot(SegmentPage, {}, {animate: true, direction: 'forward'});
          }
          else {
            this.presentToast('Problem changing password.');        
          }
        },
          error => {
            this.showPopup("Error", error);
          });
      }
    });

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

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      //cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

}
