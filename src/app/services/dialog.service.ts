import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ActivationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateAccountDialogComponent, CreatePostDialogComponent, LoginDialogComponent } from 'spiff/app/ui/components/dialogs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    loginDialog: boolean;
    urlSegments: string[];
    registerDialog: boolean;
    viewPostDialog: boolean;
    createPostDialog: boolean;

    constructor(private dialog: MatDialog, private router: Router) {
        this.urlSegments = [];
        this.router.events.subscribe(event => {
            if (event instanceof ActivationEnd) {
                this.urlSegments = event.snapshot.url.map(seg => seg.path);
            }
        });
    }

    private openDialog<T>(className: ComponentType<T>, dialogParam: string, qParams?: object): MatDialogRef<T> {
        const dialogRef = this.dialog.open(className, { width: '80%' });
        return dialogRef;
    }

    openCreatePostDialog(): void {
        if (!this.createPostDialog) this.openDialog(CreatePostDialogComponent, 'create');
    }

    openRegisterDialog(): void {
        if (!this.registerDialog) this.openDialog(CreateAccountDialogComponent, 'register');
    }

    openLoginDialog(): void {
        if (!this.loginDialog) this.openDialog(LoginDialogComponent, 'login');
    }

}
