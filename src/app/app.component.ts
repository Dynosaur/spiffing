import { Component, OnInit } from '@angular/core';
import { UserAccountService, LOCAL_STORAGE_ACCOUNT_KEY } from './services/user-account/user-account.service';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { ApiHttpService } from '@spiffing/api/services/http/api-http.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CreateAccountDialogComponent, CreatePostDialogComponent } from './ui/components/dialogs';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { DialogService } from './services/dialog';

interface LocalStorageCurrentUser {
    username: string;
    password: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: []
})
export class AppComponent implements OnInit {

    public signedIn = false;
    public username: string = null;
    public loadingUsername = false;

    constructor(private userAccount: UserAccountService,
                private dialog: DialogService,
                private ls: LocalStorageService,
                private api: ApiHttpService,
                private route: ActivatedRoute,
                private snack: SnackbarService) { }

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe(this.handleDialogQuery.bind(this));
        this.userAccount.signInEventStream.subscribe(this.onSignInEvent.bind(this));
        const lsResult = this.ls.read<LocalStorageCurrentUser>(LOCAL_STORAGE_ACCOUNT_KEY);
        if (lsResult.valid) {
            this.loadingUsername = true;
            const resp = await this.userAccount.login(lsResult.data.username, lsResult.data.password);
            console.log(resp);
            switch (resp.status) {
                case 'FAILED':
                case 'ABSENT':
                    this.snack.push('Sorry, we were unable to log you in.', 'OK', 5000);
                    break;
                case 'OTHER':
                    throw new Error('Cannot handle: ' + resp.message);
            }
            this.loadingUsername = false;
        }
    }

    private handleDialogQuery(query: Params): void {
        if (!query.dialog) {
            return;
        }
        switch (query.dialog) {
            case 'register':
                this.openRegisterDialog();
                break;
            case 'login':
                this.openLoginDialog();
                break;
            case 'post':
                this.openPostDialog();
                break;
        }
    }

    openLoginDialog(): void {
        this.dialog.openLoginDialog();
    }

    openRegisterDialog(): void {
        this.dialog.openRegisterDialog();
    }

    openPostDialog(): void {
        this.dialog.openCreatePostDialog();
    }

    private onSignInEvent(value: boolean): void {
        this.signedIn = value;
        if (this.signedIn) {
            this.username = this.userAccount.username;
        } else {
            this.username = null;
        }
    }

    public signIn(): void {
        this.dialog.openLoginDialog();
    }

    public signOut(): void {
        this.userAccount.logOut();
    }
}
