import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent, SettingsComponent } from './ui/views';

const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'user/:username', component: ProfileComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
