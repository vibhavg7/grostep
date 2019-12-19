import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,AlertController, Loading,Platform } from 'ionic-angular';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
import { AddDeliveryAddressPage } from '../add-delivery-address/add-delivery-address';
import { AddressService } from '../../providers/address-service/address-service';
import { Address } from '../../models/address';
import { PaymentPage } from '../payment/payment';
import { Network } from '@ionic-native/network';
import { BlankPage } from '../../pages/blank/blank';
import { PaymentOptionPage } from '../../pages/payment-option/payment-option';

@Component({
  selector: 'page-select-delivery',
  templateUrl: 'select-delivery.html',
})
export class SelectDeliveryPage {
  selectedeliverydate:string = '';
  selectedeliverytime :string = '';
  selectedAddressId : string = '';
  addressinfo :  Address;
  token : any;
  loading:any;
  deliverydate = [];
  deliverytime = [];
  // addressStatus : boolean =  true;  
  deliveryDates :any;
  selectedClassification : any;
  deliveryslots : any;
  dateselected : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private platform:Platform,public alertCtrl: AlertController,
              public addressService : AddressService,private loadingCtrl: LoadingController,
              private network:Network) 
  {   
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
      {
        alert('No Internet Connection Found');
        this.navCtrl.setRoot(BlankPage);
      }
      else
      {
        this.token = localStorage.getItem("token");
        if(this.navParams.get('id')==undefined) 
          this.selectedAddressId = ''; 
        else 
          this.selectedAddressId = this.navParams.get('id');
      }
    });

  }
     
  ionViewWillEnter()
  {          
    // this.loading.dismiss();
      
  }


  // getaddressStatus() : boolean
  // {
  //   return this.addressStatus;
  // }


  private hideLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  paymentpopup()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.presentAlert();
      }
    });   
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      // title: 'Low battery',
      subTitle: 'Please select delivery date and time',      
      buttons: [{
        text: 'Ok',
        cssClass:'alertCss',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }

  selectAddress()
  {    
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.selectedeliverydate = '';
        this.selectedeliverytime = '';
        this.navCtrl.push(DeliveryAddressPage,{PrevPage:"selectdelivery"});    
      }
    });    
  }

  addNewAddress()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {
        this.navCtrl.push(AddDeliveryAddressPage,{PrevPage:"selectdelivery"});     
      }
    });    
  }

  createLoader(message: string = "Please wait...") { // Optional Parameter
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  paymentoption()
  {
    this.platform.ready().then(() => {
      if(this.network.type == "none")      
        alert('No Internet Connection Found');
      else
      {       
         this.createLoader();
         this.loading.present().then(() => {
        this.addressService.addDeliveryInfo(this.addressinfo,this.selectedeliverydate,this.selectedeliverytime)
             .subscribe(response => {
                if(response)                
                  this.loading.dismiss().then( ()=>{
                    this.navCtrl.push(PaymentOptionPage);
                  });
                 
             }, error => {
               this.loading.dismiss();               
             });
       });
      }
    });
  }

  
  onchange(event)
  {        
    for (var i = 0; i < this.deliveryslots.length; i++)     
      if(this.deliveryslots[i].deliverydate == event)      
        this.deliverytime = this.deliveryslots[i].deliverytime;
  }

  ionViewWillLeave()
  {
    this.loading.dismiss();
  }

  ionViewDidLeave()
  {
    this.loading.dismiss();
  }

  ionViewWillUnload()
  {
    this.loading.dismiss();
  }

  ionViewDidLoad() {    
    this.platform.ready().then(() => {
        if(this.network.type == "none")      
        {
          alert('No Internet Connection Found');
          this.navCtrl.setRoot(BlankPage);
        }
        else
        {
          if(this.token != '')
          {            
            if(!this.loading){
              this.loading = this.loadingCtrl.create({
                  content: 'Please Wait...'
              });              
            }
            this.loading.present().then(() =>{    
                if(this.selectedAddressId == '')
                {                             
                    this.addressService.getMyDelievryAddress(this.token).subscribe(address => {
                      this.addressinfo = address;
                      this.loading.dismiss();                  
                      if(this.addressinfo != null) 
                      {                          
                        this.selectedeliverydate = '';
                        this.selectedeliverytime = '';                      
                        this.addressService.getDeliverydatetime().subscribe(deliverydatetimesslots=>{
                          this.deliveryslots = deliverydatetimesslots.deliverydlots;
                          this.deliverydate = [];                    
                          for (var i = 0; i < this.deliveryslots.length; i++)                    
                              this.deliverydate.push(this.deliveryslots[i].deliverydate);                    
                        });           
                      }                                                    
                  }) 
                }
                else
                {              
                  this.addressService.getDelievryAddressById(this.selectedAddressId).subscribe(address => {
                    this.addressinfo = address;  
                    this.loading.dismiss();                
                    if(this.addressinfo != null) 
                    {                      
                      this.addressService.getDeliverydatetime().subscribe(deliverydatetimesslots=>{
                        this.deliveryslots = deliverydatetimesslots.deliverydlots;   
                        this.deliverydate = [];                                  
                        for (var i = 0; i < deliverydatetimesslots.deliverydlots.length; i++)                    
                            this.deliverydate.push(deliverydatetimesslots.deliverydlots[i].deliverydate);                    
                        console.log(this.deliverydate);
                      })
                    }                                  
                  });
                }
            })                           
          }
        }
    });
  }

}
