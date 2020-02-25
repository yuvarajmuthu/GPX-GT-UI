import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { ConnectionrequestComponent } from './connectionrequest/connectionrequest.component';
import { ConnectionlistComponent } from './connectionlist/connectionlist.component';

const routes: Routes = [
  {
    path: '', 
    component: ConnectionlistComponent
  }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectionrequestRoutingModule { }