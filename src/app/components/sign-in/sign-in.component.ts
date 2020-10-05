// import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { FormControl, Validators } from '@angular/forms';
// import ApiUserService from '@spiffing/api/services/user';
// import { Router } from '@angular/router';
// import { UserAccountService } from '../../services/user-account/user-account.service';

// @Component({
//     selector: 'app-sign-in',
//     templateUrl: './sign-in.component.html',
//     styleUrls: ['./sign-in.component.scss']
// })



// ========== DEPRECATED IN FAVOR OF "login-dialog" ==========



// export class SignInComponent implements AfterViewInit {

//     // @ViewChild('usernameInput') public usernameInput: ElementRef;
//     // @ViewChild('passwordInput') public passwordInput: ElementRef;

//     // public usernameControl = new FormControl('', [Validators.required]);
//     // public passwordControl = new FormControl('', [Validators.required]);

//     // public errorMessage: string;
//     // public invalidInfo = false;
//     // public submitInProgress = false;

//     // constructor(private userApi: ApiUserService, private router: Router, private userAccount: UserAccountService) { }

//     // public ngAfterViewInit(): void {
//     //     setTimeout(() => this.usernameInput.nativeElement.focus(), 0);
//     // }

//     // public onUsernameKeyPress(event: KeyboardEvent): void {
//     //     if (event.key !== 'Enter') {
//     //         return;
//     //     }
//     //     if (this.usernameControl.valid) {
//     //         this.passwordInput.nativeElement.focus();
//     //     }
//     // }

//     // public onPasswordKeyPress(event: KeyboardEvent): void {
//     //     if (event.key !== 'Enter') {
//     //         return;
//     //     }
//     //     if (this.usernameControl.valid && this.passwordControl.valid) {
//     //         this.submitSignIn();
//     //     }
//     // }

//     // public async submitSignIn(): Promise<void> {
//     //     this.errorMessage = null;
//     //     this.invalidInfo = false;
//     //     this.submitInProgress = true;

//     //     const isValid = await this.userApi.assertUsernamePassword(this.usernameControl.value, this.passwordControl.value);
//     //     this.submitInProgress = false;
//     //     if (isValid) {
//     //         this.userAccount.login(this.usernameControl.value);
//     //         this.router.navigate(['']);
//     //     } else {
//     //         this.errorMessage = 'Username or password is incorrect.';
//     //         this.invalidInfo = true;
//     //     }
//     // }

// }
