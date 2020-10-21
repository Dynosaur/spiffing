import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { DialogComponent } from 'src/app/ui/components/dialog/dialog.component';
import { CreateAccountDialogComponent, CreatePostDialogComponent } from '../../ui/components/dialogs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    createPostDialog: boolean;
    registerDialog: boolean;
    loginDialog: boolean;

    urlSegments: string[];

    constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private location: Location) {
        this.urlSegments = [];
        this.router.events.subscribe(event => {
            if (event instanceof ActivationEnd) {
                this.urlSegments = event.snapshot.url.map(seg => seg.path);
            }
        });
    }

    private openDialog<T>(className: ComponentType<T>, qParam: string): void {
        const urlWithQParam = this.router.createUrlTree(this.urlSegments, {
            queryParams: { dialog: qParam }
        }).toString();
        this.location.go(urlWithQParam);

        const dialogRef = this.dialog.open(className, { width: '80%' });
        const dialogCloseSub = dialogRef.afterClosed().subscribe(() => {
            const normalUrl = this.router.createUrlTree(this.urlSegments).toString();
            this.location.go(normalUrl);
            dialogCloseSub.unsubscribe();
        });
    }

    openCreatePostDialog(): void {
        if (!this.createPostDialog) {
            this.openDialog(CreatePostDialogComponent, 'post');
            // this.location.go(this.router.createUrlTree(this.urlSegments, { queryParams: { dialog: 'post' }}).toString());
            // const dialogRef = this.dialog.open(CreatePostDialogComponent, { width: '80%' });
            // dialogRef.afterClosed().subscribe(() => {
            //     console.log('hello');
            //     this.location.go(this.router.createUrlTree(this.urlSegments).toString());
            // });
        }
    }

    openRegisterDialog(): void {
        if (!this.registerDialog) {
            this.openDialog(CreateAccountDialogComponent, 'register');
        }
    }

    openLoginDialog(): void {
        if (!this.loginDialog) {
            this.openDialog(LoginDialogComponent, 'login');
        }
    }
}
