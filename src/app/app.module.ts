import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StandaloneCardComponent } from './components/standalone-card/standalone-card.component';
import { ButtonComponent, ViewCardComponent } from './ui/components';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { ProfileComponent, SettingsComponent } from './ui/views';
import { CreateAccountDialogComponent, DeleteAccountConfirmDialogComponent, ChangeUsernameDialogComponent,
CreatePostDialogComponent } from './ui/components/dialogs';
import { DialogComponent } from './ui/components';

@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        NotFoundComponent,
        StandaloneCardComponent,
        ButtonComponent,
        CreatePostDialogComponent,
        ProfileComponent,
        LoginDialogComponent,
        CreateAccountDialogComponent,
        FormFieldComponent,
        SettingsComponent,
        ViewCardComponent,
        DeleteAccountConfirmDialogComponent,
        ChangeUsernameDialogComponent,
        DialogComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
