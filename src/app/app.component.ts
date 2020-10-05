import { Component, OnInit } from '@angular/core';
import { UserAccountService, LOCAL_STORAGE_ACCOUNT_KEY } from './services/user-account/user-account.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostDialogComponent } from './components/create-post-dialog/create-post-dialog.component';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { ApiHttpService } from '@spiffing/api/services/http/api-http.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CreateAccountDialogComponent } from './components/create-account-dialog/create-account-dialog.component';
import { SnackbarService } from './services/snackbar/snackbar.service';

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
                private dialog: MatDialog,
                private ls: LocalStorageService,
                private api: ApiHttpService,
                private route: ActivatedRoute,
                private snack: SnackbarService) { }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(this.handleDialogQuery.bind(this));
        this.userAccount.signInEventStream.subscribe(this.onSignInEvent.bind(this));
        const lsResult = this.ls.read<LocalStorageCurrentUser>(LOCAL_STORAGE_ACCOUNT_KEY);
        if (lsResult.valid) {
            this.loadingUsername = true;
            this.userAccount.login(lsResult.data.username, lsResult.data.password).then(result => {
                console.log(result);
                if (!result.success) {
                    if (result.message === 'ENORESPONSE') {
                        this.snack.push('Unable to connect to our services.', null, 5000);
                    } else {
                        throw new Error('Cannot handle: ' + result.message);
                    }
                }
                this.loadingUsername = false;
            });
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

    private openLoginDialog(): void {
        this.dialog.open(LoginDialogComponent, { width: 'fit-content' });
    }

    private openRegisterDialog(): void {
        this.dialog.open(CreateAccountDialogComponent, { width: 'fit-content' });
    }

    private openPostDialog(): void {
        this.dialog.open(CreatePostDialogComponent, { width: '80%' });
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
        this.dialog.open(LoginDialogComponent, { width: 'fit-content' });
    }

    public signOut(): void {
        this.userAccount.logOut();
    }

    public createPost(): void {
        this.dialog.open(CreatePostDialogComponent, { width: '80%' });
    }
}
