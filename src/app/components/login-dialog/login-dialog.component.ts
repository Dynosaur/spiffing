import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';
import { CreateAccountDialogComponent } from '../../ui/components/dialogs';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements AfterViewInit {

    @ViewChild('templateUsernameForm') public templateUsernameForm: ElementRef;
    @ViewChild('templatePasswordForm') public templatePasswordForm: ElementRef;

    public usernameForm = new FormControl('', [Validators.required]);
    public passwordForm = new FormControl('', [Validators.required]);

    public errorMessage: string;
    public loginInProgress: boolean;

    constructor(private api: ApiEndpointService,
                private account: UserAccountService,
                private dialog: MatDialogRef<LoginDialogComponent>,
                private createAccountDialog: MatDialog){ }

    public ngAfterViewInit(): void {
        setTimeout(() => this.templateUsernameForm.nativeElement.focus(), 0);
    }

    public onUsernameKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Enter') {
            return;
        }
        if (this.usernameForm.valid) {
            this.templatePasswordForm.nativeElement.focus();
        }
    }

    public onPasswordKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Enter') {
            return;
        }
        if (this.usernameForm.valid && this.passwordForm.valid) {
            this.submitSignIn();
        }
    }

    public async submitSignIn(): Promise<void> {
        this.errorMessage = null;
        // this.invalidInfo = false;
        this.loginInProgress = true;

        const result = await this.account.login(this.usernameForm.value, this.passwordForm.value);
        console.log(result);
        this.loginInProgress = false;
        switch (result.status) {
            case 'ABSENT':
                this.errorMessage = 'No account with that username.';
                break;
            case 'OK':
                this.dialog.close();
        }
    }

    public createNewAccount(): void {
        this.dialog.close();
        this.createAccountDialog.open(CreateAccountDialogComponent, { width: 'fit-content' });
    }

}
