import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TypeaheadComponent} from './components/typeahead/typeahead.component';
import {SearchlegislatorsComponent} from './components/searchlegislators/searchlegislators.component';
//import {UserModule} from './components/user/user.module';
//import {UserComponent} from './components/user/user/user.component';
import {RegisterComponent} from './components/security/register/register.component';
import {LoginComponent} from './components/security/login/login.component';
import {PostComponent} from './components/post/post.component';
import {ProtectedComponent} from './components/protected/protected.component';
import {CreatepageComponent} from './components/security/createpage/createpage.component';
//import {ConnectionrequestComponent} from './components/connection/connectionrequest/connectionrequest.component';
import {CreatepageselectionComponent} from './components/security/createpage/createpageselection/createpageselection.component';

import {AuthGuard} from '../app/auth/auth.guard';

const routes: Routes = [

  //{path: "user", component: UserComponent},
  {path: 'user', loadChildren: './components/user/user.module#UserModule'},
  //{path: "user/:id", loadChildren:'./components/user/user.module#UserModule' },
  {path: 'group', loadChildren: './components/group/group.module#GroupModule'},
  //{path: "group", loadChildren:'./components/user/user.module#UserModule' },
  //{path: "group/:id", loadChildren:'./components/group/group.module#GroupModule' },
  //{path: "user/legis/:id", component: UserModule },
  // { path: 'distrcit',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
  {path: 'searchLegislator', component: SearchlegislatorsComponent},
  {path: 'news', component: PostComponent, canActivate: [AuthGuard]},
  {path: 'secure', component: ProtectedComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'createpage', component: CreatepageComponent, canActivate: [AuthGuard]},
  {path: 'createpageoptions', component: CreatepageselectionComponent, canActivate: [AuthGuard]},
  {path: 'request', loadChildren: './components/connection/connection.module#ConnectionModule'},
  {path: '', redirectTo: '/searchLegislator', pathMatch: 'full'},

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
