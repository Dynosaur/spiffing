import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'spiff-change-username-dialog',
    templateUrl: './change-username-dialog.component.html',
    styleUrls: ['./change-username-dialog.component.scss']
})
export class ChangeUsernameDialogComponent implements OnInit, OnDestroy {
    signedIn: boolean;
    signInStream: Subscription;
    usernameFormControl = new FormControl();

    constructor(private user: UserAccountService, private api: ApiEndpointService, private dialog: MatDialog) {
        this.signedIn = this.user.isSignedIn;
    }

    ngOnInit(): void {
        this.signInStream = this.user.signInEventStream.subscribe(signedIn =>
            this.signedIn = signedIn
        );
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
        const updateRequest = await this.api.updateUserData(
            this.user.username,
            this.user.password,
            { username: newUsername }
        );
        if (updateRequest.ok) {
            this.user.changeUsername(newUsername);
            this.dialog.closeAll();
        }
    }

}
