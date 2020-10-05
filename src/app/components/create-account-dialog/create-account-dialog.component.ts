import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors,
    ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';
import { UserAccountService } from '@spiffing/services/user-account/user-account.service';

@Component({
    selector: 'app-create-account-dialog',
    templateUrl: './create-account-dialog.component.html',
    styleUrls: ['./create-account-dialog.component.scss']
})
export class CreateAccountDialogComponent implements OnInit {

    public usernameControl = new FormControl('', [Validators.required]);
    public passwordControl = new FormControl('', [Validators.required]);
    public retypePasswordControl = new FormControl('', [Validators.required, this.sameValueValidator(this.passwordControl)]);

    public creatingAccount = false;

    public retypePasswordErrorMap = new Map<string, string>();
    public retypePasswordErrorPriority = ['required', 'sameValue'];

    public registerError: string;

    constructor(private dialog: MatDialogRef<CreateAccountDialogComponent>,
                private api: ApiEndpointService,
                private snackbar: MatSnackBar,
                private user: UserAccountService) {
        this.retypePasswordErrorMap.set('required', 'Please retype your password');
        this.retypePasswordErrorMap.set('sameValue', 'Passwords to not match');
    }

    ngOnInit(): void {

    }

    private sameValueValidator(mustMatch: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const sameValue = mustMatch.value === control.value;
            return sameValue ? null : { sameValue: false };
        };
    }

    public async createAccount(): Promise<void> {
        this.creatingAccount = true;
        const response = await this.api.register(this.usernameControl.value, this.passwordControl.value);
        switch (response.payload.status) {
            case 'CREATED':
                await this.user.login(this.usernameControl.value, this.passwordControl.value);
                this.creatingAccount = false;
                this.dialog.close();
                this.snackbar.open('Successfully created new account.', 'OK', { duration: 3000 });
                break;
            case 'OK':
                this.creatingAccount = false;
                this.dialog.close();
                this.snackbar.open('Test registration success, no account created.', 'OK', { duration: 3000 });
                break;
            case 'REJECTED':
                this.creatingAccount = false;
                this.registerError = response.payload.status;
                break;
            case 'MALFORMED':
                this.creatingAccount = false;
                throw new Error(response.payload.message);
        }
    }

}
