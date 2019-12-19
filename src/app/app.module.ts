import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/*New pages reference add */

import { Network } from '@ionic-native/network';
// import { Facebook } from '@ionic-native/facebook';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';
// import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';



import {LoginPage} from '../pages/login/login';
import {RegistrationPage} from '../pages/registration/registration';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { ContactPage } from '../pages/contact/contact';
import { TermsandconditionsPage } from '../pages/termsandconditions/termsandconditions';
import {ForgetpasswordPage} from '../pages/forgetpassword/forgetpassword';
// import {CurrentLocationPage} from '../pages/current-location/current-location';


import { SegmentPage } from '../pages/segment/segment';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { BlankPage } from '../pages/blank/blank';

import { CartPage} from '../pages/cart/cart';
import { ProfilePage } from '../pages/profile/profile';
import { DeliveryAddressPage} from '../pages/delivery-address/delivery-address';
import { AddDeliveryAddressPage} from '../pages/add-delivery-address/add-delivery-address';
import { SelectDeliveryPage} from '../pages/select-delivery/select-delivery';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { VerifypasswordPage } from '../pages/verifypassword/verifypassword';
import { PaymentPage } from '../pages/payment/payment';
import { MyordersPage } from '../pages/myorders/myorders';
import { MyCouponsPage } from '../pages/my-coupons/my-coupons';
import { OrderDetailsPage } from '../pages/order-details/order-details';

import { PaymentOptionPage } from '../pages/payment-option/payment-option';
import { SuccessPage } from '../pages/success/success';
// import { SearchProductsPage } from '../pages/search-products/search-products';
import { CancelledOrderPage } from '../pages/cancelled-order/cancelled-order';

import { ProductService } from '../providers/product-service/product-service';
import { CartService } from '../providers/cart-service/cart-service';
import { AuthService } from '../providers/auth-service/auth-service';
import { AddressService } from '../providers/address-service/address-service';
import { VoucherService } from '../providers/voucher-service/voucher-service';
import { OrderService } from '../providers/order-service/order-service';

import { FilterCartPipe } from '../pipes/filter-cart/filter-cart';
import { CapitalizeFirstPipe } from '../pipes/capitalize-first/capitalize-first';


import { AppServiceProvider } from '../providers/app-service/app-service';
import { GeolocationServiceProvider } from '../providers/geolocation-service/geolocation-service';
import { BannerServiceProvider } from '../providers/banner-service/banner-service';

/*  */

@NgModule({
  declarations: [
    MyApp,
    FilterCartPipe,
    CapitalizeFirstPipe,
    HomePage,
    CartPage,        
    ContactPage,    
    LoginPage,
    RegistrationPage,
    ProfilePage,
    DeliveryAddressPage,
    AddDeliveryAddressPage,
    ChangePasswordPage,    
    SegmentPage,
    PaymentPage,    
    ForgetpasswordPage,
    BlankPage,    
    SelectDeliveryPage,
    VerifypasswordPage,
    TermsandconditionsPage,
    AboutusPage,    
    PaymentOptionPage,
    SuccessPage,
    // SearchProductsPage,
    ProductDetailPage,
    MyordersPage,
    MyCouponsPage,
    OrderDetailsPage,
    CancelledOrderPage,
    // CurrentLocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),   
    FormsModule,
    HttpModule,
    CommonModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,        
    CartPage,    
    ContactPage ,    
    LoginPage,
    RegistrationPage,
    ProfilePage,
    DeliveryAddressPage ,
    AddDeliveryAddressPage,
    ChangePasswordPage,    
    SegmentPage,
    PaymentPage,    
    ForgetpasswordPage,
    BlankPage,    
    SelectDeliveryPage,
    VerifypasswordPage,
    TermsandconditionsPage,
    AboutusPage,    
    PaymentOptionPage,
    SuccessPage,
    // SearchProductsPage,
    ProductDetailPage,
    MyordersPage,
    MyCouponsPage,
    OrderDetailsPage,
    CancelledOrderPage,
    // CurrentLocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ProductService,    
    CartService,
    AuthService,
    AddressService,    
    VoucherService,
    OrderService,
    AppServiceProvider,
    GeolocationServiceProvider,
    BannerServiceProvider,
    Network,
    Geolocation,
    Autostart,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
