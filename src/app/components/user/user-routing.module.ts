import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import {UserstageComponent} from './userstage/userstage.component';

const routes: Routes = [
  {
    path: '', 
    component: UserstageComponent,
    children: [
      {
          //path: ':id', loadChildren: './user.module#UserModule'
          path: ':id', component: UserComponent
      }
      //,
      //{
      //  path: ':id/:id', component: UserComponent
    //}
    ]
  }
  ///{path: "user/:id", component: UserComponent },  
  //{path: "", loadChildren:'./user.module#UserModule' },
  //{path: "user", loadChildren:'./user.module#UserModule' },
  //{path: "user/:id", loadChildren:'./user.module#UserModule' }, 
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }