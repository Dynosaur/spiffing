import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StandaloneCardComponent } from './components/standalone-card/standalone-card.component';
import { ButtonComponent } from './components/button/button.component';
import { CreatePostDialogComponent } from './components/create-post-dialog/create-post-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { CreateAccountDialogComponent } from './components/create-account-dialog/create-account-dialog.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

@NgModule({
    declarations: [
        AppComponent,
        CreateAccountComponent,
        LandingPageComponent,
        NotFoundComponent,
        StandaloneCardComponent,
        ButtonComponent,
        CreatePostDialogComponent,
        ProfileComponent,
        LoginDialogComponent,
        CreateAccountDialogComponent,
        FormFieldComponent
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
