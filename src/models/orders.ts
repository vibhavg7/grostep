export class Orders {
    _id : String;
    // name: String;    
    // //Orderdetails: String,
    // //Ordertype: Number,
    // //delievrydetails: String,
    // orderStatus : Number;
    // CouponCodeApplied : Number   
    
    token : String;
    purchased_item:String;
    total_purchased_item : Number;
    couponCode : String;
    delivery_address : String;
    delivery_date : String;
    delivery_time : String;
    amount_to_pay : Number;
    payableAmount : Number;
    savingAmount : Number;
    payment_mode : String;
    placingdatetime : string;
    status: String; 
    paid:Number
}