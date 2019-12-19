import { Pipe, PipeTransform } from '@angular/core';
import {CartItem, CartService} from '../../providers/cart-service/cart-service';

/**
 * Generated class for the FilterCartPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterCart',
  pure: false
})
export class FilterCartPipe implements PipeTransform {
  
  transform(items: Array<CartItem>, conditions: {[field: string]: any}): Array<CartItem> {
    return items.filter(item => {
        for (let field in conditions) {
            if (item[field] !== conditions[field]) {
                return false;
            }
        }
        return true;
    });
}
}
