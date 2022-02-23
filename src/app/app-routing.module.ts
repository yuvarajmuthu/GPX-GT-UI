import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {SearchlegislatorsComponent} from './components/searchlegislators/searchlegislators.component';
import {RegisterComponent} from './components/security/register/register.component';
import {LoginComponent} from './components/security/login/login.component';
import {PostComponent} from './components/post/post.component';
import {CircleComponent} from './components/circle/circle.component';
import {ProtectedComponent} from './components/protected/protected.component';
import {CreatepageComponent} from './components/security/createpage/createpage.component';
import {CreatepageselectionComponent} from './components/security/createpage/createpageselection/createpageselection.component';
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { TermsComponent } from './components/legal/terms/terms.component';

import {AuthGuard} from '../app/auth/auth.guard';

const routes: Routes = [

  {path: 'user', loadChildren: './components/user/user.module#UserModule'},
  {path: 'searchLegislator', component: SearchlegislatorsComponent},
  {path: 'circle', component: CircleComponent, canActivate: [AuthGuard]},
  {path: 'news', component: PostComponent, canActivate: [AuthGuard]},
  {path: 'secure', component: ProtectedComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'createpage', component: CreatepageComponent, canActivate: [AuthGuard]},
  {path: 'createpageoptions', component: CreatepageselectionComponent, canActivate: [AuthGuard]},
  {path: 'request', loadChildren: './components/connection/connection.module#ConnectionModule', canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'terms', component: TermsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {enableTracing: false} // <-- debugging purposes only
    )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
