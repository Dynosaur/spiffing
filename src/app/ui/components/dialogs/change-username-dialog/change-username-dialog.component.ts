import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';
import { UserAccountService } from '@spiffing/services/user-account/user-account.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'spiff-change-username-dialog',
    templateUrl: './change-username-dialog.component.html',
    styleUrls: ['./change-username-dialog.component.scss']
})
export class ChangeUsernameDialogComponent implements OnInit, OnDestroy {

    signedIn: boolean;
    usernameFormControl = new FormControl();

    signInStream: Subscription;

    constructor(private user: UserAccountService, private api: ApiEndpointService, private dialog: MatDialog) {
        this.signedIn = this.user.isSignedIn;
    }

    ngOnInit(): void {
        this.signInStream = this.user.signInEventStream.subscribe(signedIn => this.signedIn = signedIn);
    }

    ngOnDestroy(): void {
        this.signInStream.unsubscribe();
    }

    getUsername(): string {
        return this.user.username;
    }

    canChange(): boolean {
        return this.usernameFormControl.value !== this.user.username;
    }

    async changeUsername(): Promise<void> {
        const newUsername = this.usernameFormControl.value;
        const response = await this.api.updateUserData(this.user.username, this.user.password, { username: newUsername });
        switch (response.payload.status) {
            case 'OK':
                this.user.changeUsername(newUsername);
                this.dialog.closeAll();
                break;
        }
    }

}
