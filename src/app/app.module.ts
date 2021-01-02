import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { DialogComponent } from './ui/components';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { LandingPageComponent } from 'spiff/app/ui/views/landing-page';
import { LoginDialogComponent } from 'spiff/app/ui/components/dialogs/login-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StandaloneCardComponent } from './components/standalone-card/standalone-card.component';
import { ViewPostDialogComponent } from './ui/components/dialogs/view-post-dialog/view-post-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ViewCardComponent } from './ui/components';
import { ProfileComponent, SettingsComponent } from './ui/views';
import { CreateAccountDialogComponent, DeleteAccountConfirmDialogComponent, ChangeUsernameDialogComponent, CreatePostDialogComponent } from './ui/components/dialogs';

@NgModule({
    declarations: [
        AppComponent,
        ButtonComponent,
        DialogComponent,
        ProfileComponent,
        NotFoundComponent,
        SettingsComponent,
        ViewCardComponent,
        FormFieldComponent,
        LandingPageComponent,
        LoginDialogComponent,
        StandaloneCardComponent,
        ViewPostDialogComponent,
        CreatePostDialogComponent,
        CreateAccountDialogComponent,
        DeleteAccountConfirmDialogComponent,
        ChangeUsernameDialogComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MaterialModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
