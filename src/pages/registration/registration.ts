import { Component } from '@angular/core';
import { NavController, AlertController,NavParams,LoadingController, 
         Loading,ToastController,Platform  } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service'; 
import { SegmentPage } from '../segment/segment';
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { SelectDeliveryPage } from '../select-delivery/select-delivery';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  createSuccess = false;
  loading:Loading;
  PrevPage : any;
  registerCredentials = { name:'', email: '', phoneNumber :'', location:'', password: '',loginMethod:'' };  

  registrationForm : FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(public navCtrl: NavController, public navParams: NavParams,private auth: AuthService, 
    private alertCtrl: AlertController,private loadingCtrl: LoadingController,public fb: FormBuilder,
    private toastCtrl: ToastController,private platform:Platform,private network:Network) 
  {
    this.registrationForm = fb.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'name' : [null,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]{2,30}$')])],
      'email' : [null,Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'phoneNumber' : [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{10}')])],
      'location' : [null,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]{2,30}$')])],
      'password' : [null, Validators.compose([Validators.required, Validators.minLength(8)])],      
    })

    if(navParams.get('PrevPage')==undefined) 
      this.PrevPage = '' ; 
    else 
      this.PrevPage = navParams.get('PrevPage');    
  }

  public register() {
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
          this.registerCredentials.loginMethod = "1";
          this.auth.register(this.registerCredentials,this.PrevPage).subscribe(success => {      
            if (success) {        
              this.hideLoading();
              if(this.PrevPage !=null && this.PrevPage =='CartPage')
              {
                //this.presentToast('User registered sucessfully');
                this.navCtrl.push(SelectDeliveryPage, {status:"1"})
                .then(() => {
                  const startIndex = this.navCtrl.getActive().index - 2;
                  this.navCtrl.remove(startIndex, 2);
                });
              }
              else if(this.PrevPage!=null && this.PrevPage =='RegistrationPage')
              {
                //this.presentToast('User registered sucessfully');
                this.navCtrl.setRoot(SegmentPage);
              }
              else if(this.PrevPage == '')
              {
                //this.presentToast('User registered sucessfully');
                this.navCtrl.setRoot(SegmentPage); 
              }
            } 
            else 
            {
              this.hideLoading();
              this.showPopup("Error", "Problem creating account.Email Id Already exists.");
            }
          },
            error => {
              this.showPopup("Error", error);
            });
      }
    });
  }
  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
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
      duration: 200,
      position: 'bottom',
      cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

}
