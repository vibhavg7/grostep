import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,ModalController,LoadingController, 
        Loading ,Platform,ToastController} from 'ionic-angular';
import { AddressService } from '../../providers/address-service/address-service';
import { Address } from '../../models/address';
import { DeliveryAddressPage } from '../../pages/delivery-address/delivery-address';
import { SelectDeliveryPage } from '../select-delivery/select-delivery';
import { SegmentPage} from '../segment/segment';
// import { PlacePage } from '../../pages/place/place';
import {Http,Headers, Response,RequestOptions} from '@angular/http';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

/**
 * Generated class for the AddDeliveryAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-delivery-address',
  templateUrl: 'add-delivery-address.html',
})

export class AddDeliveryAddressPage {
  //@ViewChild('myinput') input
  private focused: boolean
  createSuccess = false;
  PrevPage : any;  
  addressId : any;
  location : any;
  addresslocation : any;
  updateAddressButton : boolean = false;
  registerCredentials = { tokenId:'', firstname: "", lastname: "" , location : "",addresstype :"",
                        flatNumber : "", address : "" , pincode : "" , phone : "" ,status :"" };
  addAddressForm : FormGroup;
  constructor(public navCtrl: NavController,public platform :Platform, 
              private addressService: AddressService,public navParams: NavParams,
              private alertCtrl: AlertController,public modalCtrl : ModalController,
              public fb: FormBuilder,private loadingCtrl: LoadingController,
              private network : Network,public http: Http,private toastCtrl: ToastController)
     //,private nativeGeocoder: NativeGeocoder) 
  { 
        
    this.addAddressForm = fb.group({
      // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
      'addresstype' : [null, Validators.required],
      'firstname' : [null,Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]{2,30}$')])],
      'lastname' : [null, Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]{2,30}$')])],
      'pincode' : [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{6}')])],
      'location' : [null, Validators.compose([Validators.required])],      
      'flatNumber' : [null, Validators.compose([Validators.required])],      
      'address' : [null, Validators.compose([Validators.required])],      
      'phone' : [null, Validators.compose([Validators.required,Validators.pattern('^[0-9]{10}')])],      
    })

    if(navParams.get('PrevPage')==undefined) 
      this.PrevPage = '' ; 
    else 
      this.PrevPage = navParams.get('PrevPage');    

    if(navParams.get('addressId')==undefined || navParams.get('addressId') == '') 
      this.addressId = '' ; 
    else if(navParams.get('addressId') != '' && navParams.get('PrevPage') == 'profile')
    {
      this.addressId = navParams.get('addressId');
      this.updateAddressButton = true;
    }
  }
 
  
  ionViewWillEnter()
  { 
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        if(this.addressId != '' && this.PrevPage == 'profile')
        {
          this.addressService.getDelievryAddressById(this.addressId).subscribe(addressinfo => {
            
            this.registerCredentials.firstname = addressinfo.firstname;
            this.registerCredentials.lastname = addressinfo.lastname;
            this.registerCredentials.location = addressinfo.location;
            this.registerCredentials.address = addressinfo.address;
            this.registerCredentials.pincode =  addressinfo.pincode;
            this.registerCredentials.phone = addressinfo.phone;  
            this.registerCredentials.flatNumber = addressinfo.flatNumber;   
            this.registerCredentials.status = addressinfo.status;
            this.registerCredentials.addresstype = addressinfo.addresstype;
            this.registerCredentials.tokenId =  localStorage.getItem("token");
          })
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
        this.registerCredentials.tokenId = localStorage.getItem("token");
        if(this.addressId != '')
        {      
          this.addressService.editDelievryAddress(this.addressId,this.registerCredentials).subscribe(data =>{        
                if(data.success)
                {              
                  this.presentToast('Delivery address updated successfully');
                  this.navCtrl.push(DeliveryAddressPage,{PrevPage : "profile"})
                  .then(() => {
                    const startIndex = this.navCtrl.getActive().index - 2;
                    this.navCtrl.remove(startIndex, 2);
                  }); 
                }
                else
                {
                  this.presentToast('Unable to update the address');
                  this.navCtrl.push(DeliveryAddressPage)
                  .then(() => {
                    const startIndex = this.navCtrl.getActive().index - 2;
                    this.navCtrl.remove(startIndex, 2);
                  });
                }
          });
        }
        else
        {
          if(this.PrevPage!=null)
          {
            this.registerCredentials.status = "1"; 
          }
          console.log(this.registerCredentials);
          this.addressService.addDelievryAddress(this.registerCredentials).subscribe(success => {
            if (success) {
              
              if(this.PrevPage!=null && this.PrevPage =='profile')
              {
                    this.presentToast('Delivery address added successfully');
                    this.navCtrl.push(DeliveryAddressPage, {status:"1",PrevPage : this.PrevPage})
                    .then(() => {
                      const startIndex = this.navCtrl.getActive().index - 2;
                      this.navCtrl.remove(startIndex, 2);
                    });
              }
              if(this.PrevPage!=null && this.PrevPage =='selectdelivery')
              {            
                    this.presentToast('Delivery address added successfully');
                    this.navCtrl.push(SelectDeliveryPage, {status:"1",PrevPage : this.PrevPage})
                    .then(() => {
                      const startIndex = this.navCtrl.getActive().index - 2;
                      this.navCtrl.remove(startIndex, 2);
                    });
              }
              else
              {
                this.presentToast('Delivery address added successfully');
                this.navCtrl.setRoot(SegmentPage, {}, {animate: true, direction: 'forward'});
              }
            } else {
              this.showPopup("Error", "Problem creating account.");
            }
          },
            error => {
              this.showPopup("Error", error);
            });
        }
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

  onLocateUser()
  {
    // var options = {
    //   enableHighAccuracy: true
    // };
    // this.geolocation.getCurrentPosition(options)
    //   .then(
    //     (location) =>{
    //         this.location = location;
    //         // console.log(this.location);
    //         // console.log(this.location.coords);
    //         // this.nativeGeocoder.reverseGeocode(this.location.coords.latitude, this.location.coords.longitude)
    //         // .then((result: NativeGeocoderReverseResult) => 
    //         // { 
    //         //   this.addresslocation = JSON.stringify(result[0]);
    //         //   //alert("The address is: \n\n" + JSON.stringify(result[0]))
    //         // }
    //         // )
    //         // .catch((error: any) => console.log(error));
    //         //console.log(this.location);
    //     }
    //   )
    //   .catch((error) => {
    //     console.log('Error getting location', error);
    //   });
    // //this.modalCtrl.create(PlacePage).present();
  }

  obtenerPosicion()
  {
    // this.geolocation.getCurrentPosition().then(response => {
    //   console.log(response);
    //   this.location = response.coords;
    // })
    //   .catch(error => {
    //     console.log(error);
    //   })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      // cssClass: "bottomToast",
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  ionViewDidLoad() {
    
    this.platform.ready().then(() => this.obtenerPosicion());
    console.log('ionViewDidLoad AddDeliveryAddressPage');
  }

}
