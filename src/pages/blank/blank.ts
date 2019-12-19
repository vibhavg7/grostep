import { Component } from '@angular/core';
import { Events,  NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
// import {SegmentPage } from '../../pages/segment/segment';
import { HomePage } from '../../pages/home/home';
// import { NetworkService} from '../../providers/network-service/network-service';


/**
 * Generated class for the BlankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html',
})
export class BlankPage {
//,private networkService:NetworkService,
  constructor(public navCtrl: NavController, public navParams: NavParams,public events :Events,
    public network: Network,
    private toastCtrl: ToastController,private platform: Platform) {

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlankPage');
  }

  reloadapp()
  {

    this.platform.ready().then(() => {
      if(this.network.type != "none")      
      {       
        this.navCtrl.setRoot(HomePage);                        
      }
    });

  }


  ionViewWillLeave()
  {
  }


}
