import { Component } from '@angular/core';
import { NavController, NavParams,AlertController, LoadingController, 
  Loading,ToastController,Platform } from 'ionic-angular';
import { AddressService } from '../../providers/address-service/address-service';
import { Address } from '../../models/address';
import { HomePage } from '../../pages/home/home';
import {AddDeliveryAddressPage} from '../add-delivery-address/add-delivery-address';
import { SelectDeliveryPage } from '../select-delivery/select-delivery';
import {SegmentPage} from '../segment/segment';
import { ProfilePage } from '../profile/profile';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { GeolocationServiceProvider } from '../../providers/geolocation-service/geolocation-service';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the DeliveryAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-delivery-address',
  templateUrl: 'delivery-address.html',
})
export class DeliveryAddressPage {
  addressList : Address[];
  loading : any;
  address :  Address; 
  createSuccess = false;
  fromPage : any;
  registerCredentials = { status :"",_id:"",tokenId:""}; 
  deleteiconvisible : boolean = false;
  editiconvisible : boolean = false;   
  PrevPage : any;
  addDelievryAddressLink : boolean = false;
  constructor(public navCtrl: NavController, 
              private addressService: AddressService, public navParams: NavParams,
              private alertCtrl: AlertController,
              public geolocationServiceProvider : GeolocationServiceProvider,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,private platform:Platform,private network : Network) 
  {
        
  }
    
  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.PrevPage = this.navParams.get('PrevPage');            
    
        if(this.PrevPage != undefined && this.PrevPage =="profile")
         {
            this.deleteiconvisible = true;
            this.editiconvisible = true;
         }
        
         if(this.PrevPage != undefined && this.PrevPage =="segmentPage")
         {           
          this.addDelievryAddressLink = true;            
         }
         else
         {
          this.addDelievryAddressLink = false;  
         }

        if(!this.loading){
          this.loading = this.loadingCtrl.create({
              content: 'Please Wait...'
          });
          this.loading.present();
        }
    
        this.addressService.getDelievryAddress().subscribe(addressinfo => {
          this.addressList = addressinfo;      
          this.hideLoading();
        })    
      }
    });
  }
    
  chooseCurrentLocation()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.geolocation.getCurrentPosition().then((data) => {         
         this.geolocationServiceProvider.getLocation(data.coords.latitude,data.coords.longitude)
         .subscribe(response =>{           
            localStorage.setItem("currentlocation", response.results[3].formatted_address);  
            this.navCtrl.setRoot(SegmentPage, {}, {animate: true, direction: 'forward'});          
         })          
         }).catch((error) => {
           console.log('Error getting location', error);
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

  addressSelected(item : Address)
  {       
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.registerCredentials.status = "1";
        this.registerCredentials._id = item._id;
        this.registerCredentials.tokenId = localStorage.getItem("token");    
        this.addressService.editDelievryAddressStatus(this.registerCredentials).subscribe(success => {
          
          if (success) {
            
            if(this.PrevPage =="profile")
            {          
              this.navCtrl.setRoot(SegmentPage, {}, {animate: true, direction: 'forward'});
              this.presentToast('Delivery address changed successfully');
              
            }
            else if(this.PrevPage =="selectdelivery")
            {
              this.presentToast('Delivery address changed successfully');
              this.navCtrl.push(SelectDeliveryPage, {id: item._id,status:"1"})
              .then(() => {
                const startIndex = this.navCtrl.getActive().index - 2;
                this.navCtrl.remove(startIndex, 2);
              });          
            }
            
          } else {
            this.showPopup("Error", "Problem creating account.");
          }
        },
          error => {
            this.showPopup("Error", error);
          });            
      }
    });
  }


  editDeliveryAddress(address)
  {    this.platform.ready().then(() => {
    if(this.network.type == "none")      
      alert('No Internet Connection Found');
    else
    {
      this.navCtrl.push(AddDeliveryAddressPage,{addressId:address._id,PrevPage:"profile"});
    }
  });    
  }

  deleteDeliveryAddress(addressinfo : Address)
  {    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        if(addressinfo.status =="1")
        {
          this.presentToast('Selected address cannot be deleted');
        }
        else
        {
          let confirm = this.alertCtrl.create({
            title: 'Confirm Delete',
            subTitle: 'Are you sure you want to delete the address',
            cssClass: 'alertDanger',
            buttons: [
              {
                text: 'NO',
                handler: () => {
                  console.log('No clicked');
                }
              },
              {
                text: 'YES',
                handler: () => {            
                  if(!this.loading){
                    this.loading = this.loadingCtrl.create({
                        content: 'Please Wait...'
                    });
                    this.loading.present();
                  }
                  this.addressService.deleteDeliveryAddress(addressinfo._id).subscribe(data => {
                      this.hideLoading();          
                      if(data.success && data.statusCode == '4')
                      {
                        this.presentToast('Address successfully deleted');
                        this.navCtrl.push(ProfilePage);
                      }
                      else
                        this.presentToast('Error deleting Address');
                  });        
                }
              }
            ]
          });
          confirm.present()  
        }
      }
    });
  }

   addDelievryAddress()
   {     
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        if(this.PrevPage =="profile")
        {
          this.navCtrl.push(AddDeliveryAddressPage,{PrevPage:"profile"});  
        }
        else if(this.PrevPage == "selectdelivery")
        {
          this.navCtrl.push(AddDeliveryAddressPage,{PrevPage:"selectdelivery"});  
        }
        else{
          this.navCtrl.push(AddDeliveryAddressPage,{PrevPage:"segment"});  
        }
      }
    });

    
   }
  
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      cssClass: 'alertDanger',
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
      position: 'bottom'
      // cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryAddressPage');
  }

}
