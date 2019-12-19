import { Component } from '@angular/core';
import { NavController, AlertController,NavParams,LoadingController, 
  Loading,ToastController,Platform  } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { Contactus } from '../../models/contactus'; 
// import { AuthService } from '../../providers/auth-service/auth-service'; 
// import { SegmentPage } from '../segment/segment';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
// import { CallNumber } from '@ionic-native/call-number';


/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  
  // contactus = { name:'', phone: '', email :'', message:''};
  loading: Loading;
  contactdetails : Contactus;
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform:Platform,
              private network:Network,private appService:AppServiceProvider,
              private toastCtrl: ToastController,
              // private callNumber1: CallNumber,
              private loadingCtrl: LoadingController) 
  {

  }

  ionViewWillEnter()
  {
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
    
        this.appService.getInfo('contactus').subscribe(contactusinfo => {
          console.log(contactusinfo);     
          this.contactdetails = contactusinfo;
          //console.log(this.contactdetails);     
          this.hideLoading();
        })    
      }
    });
  }

  callNumber(number)
  {
    // this.callNumber1.callNumber(number, true)
    // .then(res => console.log('Launched dialer!', res))
    // .catch(err => console.log('Error launching dialer', err));
  }

  // submit()
  // {
  //   this.platform.ready().then(() => {
  //     if(this.network.type == "none")      
  //       alert('No Internet Connection Found');
  //     else
  //     {
  //       if(!this.loading){
  //         this.loading = this.loadingCtrl.create({
  //             content: 'Please Wait...'
  //         });
  //         this.loading.present();
  //       }

  //       this.auth.contactus(this.contactus).subscribe(success => {     
  //         this.hideLoading(); 
  //         if (success) 
  //         {
  //           this.presentToast('Contact Information saved sucessfully');
  //           this.navCtrl.setRoot(SegmentPage);
  //         }
  //         else
  //         {
  //           this.presentToast('Problem unable to contact healthylife');                        
  //         }
  //       });
  //     }
  //   });
  // }

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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

}
