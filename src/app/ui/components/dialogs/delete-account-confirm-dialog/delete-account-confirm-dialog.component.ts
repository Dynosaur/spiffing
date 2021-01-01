import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'spiff/app/services/snackbar.service';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-delete-account-confirm-dialog',
    templateUrl: './delete-account-confirm-dialog.component.html',
    styleUrls: ['./delete-account-confirm-dialog.component.scss']
})
export class DeleteAccountConfirmDialogComponent {
    accountDeletionInProgress = false;

    constructor(private dialog: MatDialog,
                private router: Router,
                private snackbar: SnackbarService,
                private user: UserAccountService,
                private api: ApiEndpointService) { }

    async deleteAccount(): Promise<void> {
        this.accountDeletionInProgress = true;
        const deregisterRequest = await this.api.deregister(this.user.username, this.user.password);
        if (deregisterRequest.ok) {
            this.accountDeletionInProgress = false;
            this.dialog.closeAll();
            this.user.logOut();
            this.snackbar.push('Account successfully deleted.', 'OK', 3000);
            this.router.navigate(['']);
        }
    }

}
