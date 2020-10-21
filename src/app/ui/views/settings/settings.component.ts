import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAccountService } from '@spiffing/services/user-account/user-account.service';
import { ChangeUsernameDialogComponent, DeleteAccountConfirmDialogComponent } from '../../components/dialogs';

@Component({
    selector: 'spiff-settings-view',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    usernameFormControl = new FormControl(this.user.username);

    constructor(private user: UserAccountService, private dialog: MatDialog, private router: Router) { }

    ngOnInit(): void {
        if (!this.user.isSignedIn) {
            this.router.navigate(['']);
        }
    }

    isUsernameInputClean(): boolean {
        console.log(this.usernameFormControl.value);
        if (this.usernameFormControl.value === null) {
            return true;
        }
        return this.usernameFormControl.value === this.user.username;
    }

    changeUsername(): void {
        this.dialog.open(ChangeUsernameDialogComponent, { autoFocus: false });
    }

    deleteAccount(): void {
        this.dialog.open(DeleteAccountConfirmDialogComponent);
    }

}
