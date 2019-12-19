import { Component, ViewChild } from '@angular/core';
import { Events,Platform,ToastController , MenuController, Nav,AlertController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';

import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { ContactPage } from '../pages/contact/contact';
import { TermsandconditionsPage } from '../pages/termsandconditions/termsandconditions';
import { AboutusPage } from '../pages/aboutus/aboutus';

import { SegmentPage } from '../pages/segment/segment';
import { CartPage } from '../pages/cart/cart';
import { ProfilePage } from '../pages/profile/profile';
import { DeliveryAddressPage} from '../pages/delivery-address/delivery-address';
import { AddDeliveryAddressPage} from '../pages/add-delivery-address/add-delivery-address';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MyordersPage } from '../pages/myorders/myorders';

// import { CurrentLocationPage } from '../current-location/current-location';

import { AuthService } from '../providers/auth-service/auth-service';
import { Segment } from 'ionic-angular/components/segment/segment';
import { GeolocationServiceProvider } from '../providers/geolocation-service/geolocation-service';
import { Geolocation } from '@ionic-native/geolocation';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public counter=0;  
  loggedInPages: PageInterface[] = [
     { title: 'Home', name: 'HomePage', component: HomePage, icon: 'home' },     
     { title: 'Profile', name: 'ProfilePage', component: ProfilePage, icon: 'person' },      
     { title: 'My Order', name: 'MyordersPage', component: MyordersPage, icon: 'basket' },
     { title: 'Contact Us', name: 'ContactPage', component: ContactPage, icon: 'call' },
     { title: 'Terms & Conditions', name: 'TermsandconditionsPage', component: TermsandconditionsPage, icon: 'document' },
     { title: 'About Us', name: 'AboutusPage', component: AboutusPage, icon: 'people' },
     { title: 'Logout', name: '', component: '', icon: 'log-out', logsOut: true }  
   ];
   loggedOutPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: HomePage, icon: 'home' }, 
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Register', name: 'RegistrationPage', component: RegistrationPage, icon: 'create' },
    { title: 'Contact Us', name: 'ContactPage', component: ContactPage, icon: 'call' },
    { title: 'Terms & Conditions', name: 'TermsandconditionsPage', component: TermsandconditionsPage, icon: 'document' },
    { title: 'About Us', name: 'AboutusPage', component: AboutusPage, icon: 'people' },     
   ];   
   
  
   loggedInUser =  (this.auth.username != null && this.auth.username != '') ? this.auth.username.charAt(0).toUpperCase() + this.auth.username.substr(1).toLowerCase():''

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private auth: AuthService,
    public geolocationServiceProvider : GeolocationServiceProvider,
    private geolocation: Geolocation,    
    public events : Events,
    public toastCtrl: ToastController,
    private network: Network,
    public alertCtrl: AlertController,
    private backgroundMode: BackgroundMode,
    private autostart: Autostart
    ){
    this.initializeApp();
    this.auth.hasLoggedIn().then((hasLoggedIn) => {   
      this.enableMenu(hasLoggedIn === true);
    });    

    this.listenToLoginEvents();
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      this.autostart.enable();
      this.autostart.disable();
      this.statusBar.show();
      this.statusBar.overlaysWebView(false);      
      this.statusBar.backgroundColorByHexString('#669b2e');
      this.splashScreen.hide();     
      
      // if(localStorage.getItem("currentlocation") != null &&
      //     localStorage.getItem("currentlocation") != '')
      // {
      //   this.rootPage = SegmentPage
      // }
      // else
      // {
      //   this.geolocation.getCurrentPosition().then((data) => {       
      //     this.geolocationServiceProvider.getLocation(data.coords.latitude,data.coords.longitude)
      //     .subscribe(response =>{         
      //        localStorage.setItem("currentlocation", response.results[3].formatted_address);
      //        if(localStorage.getItem("currentlocation") != null &&
      //            localStorage.getItem("currentlocation") != '')
      //        {
      //          this.rootPage = SegmentPage
      //        }          
      //     })        
      //     }).catch((error) => {
      //       console.log('Error getting location', error);
      //     });   
      // }
      
      document.addEventListener('deviceready', function () {        
        this.backgroundMode.enable();
      }, false);
                 
    });
  }



  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }


  openPage(page: PageInterface) {
    let params = {};
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if(page.name =='ProfilePage' || page.name =='ContactPage' || page.name =='TermsandconditionsPage'
      || (page.name == 'MyordersPage')
        || page.name=='AboutusPage' || page.name =='LoginPage' || page.name =='RegistrationPage')
    this.nav.push(page.component, params).catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });
    else    
    this.nav.setRoot(page.component, params).catch((err: any) => {
      console.log(`Didn't set nav root: ${err}`);
    });
        
    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.platform.ready().then(() => {
        if(this.network.type == "none")      
          alert('No Internet Connection Found');
        else
        {
          let confirm = this.alertCtrl.create({
            subTitle: 'Are you sure you want to logout?',
            buttons: [
              {
                text: 'Cancel',
                cssClass:'cancelcss',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Confirm',
                cssClass:'removecss',
                handler: () => {
                  this.auth.logout();
                  this.nav.setRoot(HomePage);
                }
              }
            ]
          });
          confirm.present();
        }
      });        
    }
  }
}
