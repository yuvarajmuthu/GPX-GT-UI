import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import {User} from '../../../models/user'; 
import {Connection} from '../../../models/connection';

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';

import { ConnectionrequestComponent } from '../connectionrequest/connectionrequest.component';

@Component({
  selector: 'app-connectionlist',
  templateUrl: './connectionlist.component.html',
  styleUrls: ['./connectionlist.component.css']
})
export class ConnectionlistComponent implements OnInit {

  loggedUser:User;
  connectionRequest:Connection[];

  constructor(private userService:UserService, 
    private dataShareService:DatashareService, 
    private changeDetector : ChangeDetectorRef) { 
      console.log("constructor() connectionrequest.component");

    }

  ngOnInit() {
    console.log("ngOnInit() connectionrequest.component");

    this.loggedUser = this.dataShareService.getCurrentUser();
    this.loadConnectionRequests();
  }

  loadConnectionRequests(){
    this.userService.getConnectionRequests(this.loggedUser.username)
    .subscribe((response) => {
      this.connectionRequest= response;
      console.log('ConnectionRequests response data ', this.connectionRequest);
      //this.changeDetector.detectChanges();
    });
  }
}
