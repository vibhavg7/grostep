import { Component } from '@angular/core';
import { NavController, NavParams, Platform,LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AppServiceProvider } from '../../providers/app-service/app-service';
import { Aboutus } from '../../models/aboutus';
/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {

  loading : Loading;
  aboutus : Aboutus;
  constructor(public navCtrl: NavController, public navParams: NavParams,private platform :Platform,
              private network : Network,private loadingCtrl: LoadingController,
              private appService : AppServiceProvider ) 
  {

  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
      {        
        //this.loading.dismiss();            
        alert('No Internet Connection Found');
        this.navCtrl.setRoot(BlankPage);
      }
      else
      {
        if(!this.loading){
          this.loading = this.loadingCtrl.create({
              content: 'Please Wait...'
          });
          this.loading.present();
        }
    
        this.appService.getInfo('aboutus').subscribe(aboutusinfo => {               
          this.aboutus= aboutusinfo;
          this.aboutus.informationarray = this.aboutus.information.split('.');
          for(var i = 0; i <this.aboutus.informationarray.length; i++) 
          {
            this.aboutus.informationarray[i] = this.aboutus.informationarray[i] + '.';
          }          
          this.hideLoading();
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');
  }

}
