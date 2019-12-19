import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../../pages/login/login';
/**
 * Generated class for the VerifypasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-verifypassword',
  templateUrl: 'verifypassword.html',
})
export class VerifypasswordPage {

  createSuccess = false;  
  verifypassword = { otp : '',npwd:'',cpwd:'' ,email:'' };
  constructor(public navCtrl: NavController,public auth :AuthService, public navParams: NavParams
              ,private toastCtrl : ToastController,private alertCtrl: AlertController) {
  }

  verifyOTP()
  {
    //console.log("NAV Params" + this.navParams.get('otp')+ this.navParams.get('createddate'));
    if(this.navParams.get('otp') == this.verifypassword.otp)
    {
      this.verifypassword.email = this.navParams.get('email');
      this.auth.changeforgetPwd(this.verifypassword).subscribe(response => {     
        if (response.success) 
        {
          this.createSuccess = true;
          this.presentToast('Password changed successfully.');
          this.navCtrl.push(LoginPage)
          .then(() => {
            const startIndex = this.navCtrl.getActive().index - 2;
            this.navCtrl.remove(startIndex, 2);
          });
          //this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'forward'});
        }
        else {
          this.presentToast('Problem changing password.');        
        }
      },
        error => {
          this.showPopup("Error", error);
        });
    }
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
      duration: 2500,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifypasswordPage');
  }

}
