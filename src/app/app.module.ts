import { NgModule } from '@angular/core';
import { DateAgoPipe } from 'spiff/app/pipes/date-ago.pipe';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { PostComponent } from './ui/views/post/post.component';
import { MaterialModule } from './material.module';
import { CommaNumberPipe } from 'spiff/app/pipes/comma-number.pipe';
import { DialogComponent } from 'spiff/app/ui/components';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PrettyNumberPipe } from 'spiff/app/pipes/pretty-number.pipe';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { LandingPageComponent } from 'spiff/app/ui/views/landing-page';
import { LoginDialogComponent } from 'spiff/app/ui/components/dialogs/login-dialog';
import { RateCounterComponent } from 'spiff/app/ui/components/rate-counter/rate-counter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StandaloneCardComponent } from './components/standalone-card/standalone-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ViewCardComponent } from './ui/components';
import { ProfileComponent, SettingsComponent } from './ui/views';
import { CreateAccountDialogComponent, DeleteAccountConfirmDialogComponent, ChangeUsernameDialogComponent, CreatePostDialogComponent } from './ui/components/dialogs';

@NgModule({
    declarations: [
        DateAgoPipe,
        AppComponent,
        PostComponent,
        ButtonComponent,
        CommaNumberPipe,
        DialogComponent,
        PrettyNumberPipe,
        ProfileComponent,
        NotFoundComponent,
        SettingsComponent,
        ViewCardComponent,
        FormFieldComponent,
        LandingPageComponent,
        LoginDialogComponent,
        RateCounterComponent,
        StandaloneCardComponent,
        CreatePostDialogComponent,
        CreateAccountDialogComponent,
        ChangeUsernameDialogComponent,
        DeleteAccountConfirmDialogComponent,
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
