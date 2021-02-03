import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { ActivationEnd, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcceptedElements, TextFieldDialogComponent } from 'spiff/app/ui/components/text-field-dialog/text-field-dialog.component';
import { CreateAccountDialogComponent, LoginDialogComponent } from 'spiff/app/ui/components/dialogs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    loginDialog: boolean;
    urlSegments: string[];
    registerDialog: boolean;
    viewPostDialog: boolean;
    createPostDialog: boolean;

    constructor(private dialog: MatDialog, private router: Router, private account: UserAccountService) {
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

    openGenericDialog(
        title = 'Title',
        description = 'Description.',
        fields: AcceptedElements[] = [],
        onSubmit?: (instance: TextFieldDialogComponent) => void
    ): MatDialogRef<TextFieldDialogComponent> {
        const dialog = this.dialog.open(TextFieldDialogComponent, { width: '80%' });
        const instance = dialog.componentInstance;
        instance.description = description;
        instance.dialogRef = dialog;
        instance.fields = fields;
        instance.title = title;
        instance.submit.subscribe(() => onSubmit(instance));
        return dialog;
    }

    openCreatePostDialog(): void {
        const titleControl = new FormControl(null, [Validators.required]);
        const contentControl = new FormControl(null, [Validators.required]);
        this.openGenericDialog('Create Post', '', [
            { element: 'input',     name: 'title input',   label: 'Title',   formControl: titleControl },
            { element: 'text-area', name: 'content input', label: 'Content', formControl: contentControl }
        ], async ref => {
            ref.loading = true;
            const createPostResponse = await this.account.createPost(titleControl.value, contentControl.value);
            if (createPostResponse.ok === true) {
                ref.closeDialog();
            } else throw new Error(createPostResponse.error);
        });
    }

    openRegisterDialog(): void {
        if (!this.registerDialog) this.openDialog(CreateAccountDialogComponent, 'register');
    }

    openLoginDialog(): void {
        if (!this.loginDialog) this.openDialog(LoginDialogComponent, 'login');
    }

}
