import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sameValueValidator(mustMatch: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
        const sameValue = mustMatch.value === control.value;
        return sameValue ? null : { sameValue: { value: control.value }};
    };
}
