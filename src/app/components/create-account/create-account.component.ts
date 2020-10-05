import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import ApiUserService from '@spiffing/api/services/user';
import { Navigation, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

    usernameControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required]);
    retypePasswordControl = new FormControl('', [Validators.required, this.sameValueValidator(this.passwordControl)]);
    submitInProgress = false;

    constructor(private userApi: ApiUserService, private router: Router) { }

    private sameValueValidator(mustMatch: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const sameValue = mustMatch.value === control.value;
            return sameValue ? null : { sameValue: { value: control.value }};
        };
    }

    allFieldsSatisfied(): boolean {
        return this.usernameControl.valid && this.passwordControl.valid && this.retypePasswordControl.valid;
    }

    async submit(): Promise<void> {
        this.submitInProgress = true;
        const res = await this.userApi.createNewUser(this.usernameControl.value, this.passwordControl.value);
        this.submitInProgress = false;
        if (res instanceof HttpErrorResponse) {
            console.error('Error while submitting.');
        } else {
            this.router.navigate(['']);
        }
    }

    ngOnInit(): void {
    }



}
