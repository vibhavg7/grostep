import {FormControl } from '@angular/forms';

export class PasswordValidation {
    
        static MatchPassword(fc: FormControl) {
           let password = fc.get('password').value; // to get value in input tag
           let confirmPassword = fc.get('confirmPassword').value; // to get value in input tag
            if(password != confirmPassword) {
                console.log('false');
                return ({MatchPassword: true});
                //AC.get('confirmPassword').setErrors( {MatchPassword: true} )
            } else {
                console.log('true');
                return null
            }
        }
    }