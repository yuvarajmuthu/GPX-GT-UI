import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConnectionrequestRoutingModule} from './connection-routing.module';
import { ConnectionrequestComponent } from './connectionrequest/connectionrequest.component';
import { ConnectionlistComponent } from './connectionlist/connectionlist.component';

@NgModule({
  imports: [
    CommonModule,
    ConnectionrequestRoutingModule
  ],
  declarations: [ConnectionrequestComponent, ConnectionlistComponent]
})
export class ConnectionModule { }
