import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';
import { SnackbarService } from '@spiffing/services/snackbar/snackbar.service';
import { UserAccountService } from '@spiffing/services/user-account/user-account.service';

@Component({
    selector: 'app-delete-account-confirm-dialog',
    templateUrl: './delete-account-confirm-dialog.component.html',
    styleUrls: ['./delete-account-confirm-dialog.component.scss']
})
export class DeleteAccountConfirmDialogComponent implements OnInit {

    accountDeletionInProgress = false;

    constructor(private dialog: MatDialog,
                private router: Router,
                private snackbar: SnackbarService,
                private user: UserAccountService,
                private api: ApiEndpointService) { }

    ngOnInit(): void {
    }

    async deleteAccount(): Promise<void> {
        this.accountDeletionInProgress = true;
        const resp = await this.api.deregister(this.user.username, this.user.password);
        switch (resp.payload.status) {
            case 'OK':
                this.accountDeletionInProgress = false;
                this.dialog.closeAll();
                this.user.logOut();
                this.snackbar.push('Account successfully deleted.', 'OK', 3000);
                this.router.navigate(['']);
                break;
        }
    }

}
