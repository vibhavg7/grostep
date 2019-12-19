export class Voucher
{
    _id : string;
    codeName: String;
    available_count: Number;
    minimumorder : Number;
    expiry_date : String;
    location : String;
    description: String;
    savingPercentage: number;
    couponValue : Number;
    CalculateByPercentage : boolean;
    token: String;
    status: Number;
    applicableForAll : Number;
    applied_using : Number
}