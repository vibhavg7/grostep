export class Product {
    _id : String;
    main_category_name : string;
    category_ids:[{
        type: Number
    }];
    combo : String;
    discount_percentage : Number;
    available_quantity_type : String;
    combo_description : String;
    //sub_category_name: String;
    product_name: String;
    product_name_hindi : String;
    stock: Number;
    our_price : number;
    market_price : number;
    landing_price : number;
    available_multiple_quantity : String;
    quantity_available: [{
        type: String
    }];
    orignal_weight : number;
    selected_weight : number;
    orignal_our_price : number;
    orignal_market_price : number;
    details: String;
    //1->Fruits, 2-> Vegetable 3-> Daily Products 4 -> Spices 5 -> Dry Fruits 6 -> Gym Products
    product_type: Number;
    product_img : String;    
    reviews :  String;
    rating : Number;
    added : boolean;  
    quantity_added : number;
    seller_id : String;
    savingPercentage : number;
}