import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { ChangeUsernameDialogComponent, DeleteAccountConfirmDialogComponent } from 'spiff/app/ui/components/dialogs';

@Component({
    selector: 'spiff-settings-view',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    usernameFormControl = new FormControl(this.user.username);

    constructor(private user: UserAccountService, private dialog: MatDialog, private router: Router, private title: Title) { }

    ngOnInit(): void {
        this.title.setTitle('user settings');
        if (!this.user.isSignedIn) this.router.navigate(['']);
    }

    isUsernameInputClean(): boolean {
        console.log(this.usernameFormControl.value);
        if (this.usernameFormControl.value === null) return true;
        return this.usernameFormControl.value === this.user.username;
    }

    changeUsername(): void {
        this.dialog.open(ChangeUsernameDialogComponent, { autoFocus: false });
    }

    deleteAccount(): void {
        this.dialog.open(DeleteAccountConfirmDialogComponent);
    }
}
