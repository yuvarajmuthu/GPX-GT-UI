import { Component, OnInit } from '@angular/core';

import {Usercard2Component} from '../user/usercard2/usercard2.component';

import {UserService} from '../../services/user.service';
import {DatashareService} from '../../services/datashare.service';

import {User} from '../../models/user';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements OnInit {
  loggedUser: User = null;
  loggedUsername: string = null;
  circleUsers:string[] = null;

  constructor(private userService: UserService,
    private datashareService: DatashareService,
    ) { 

  }
 
  ngOnInit() {
    this.loggedUser = this.datashareService.getCurrentUser();

    if (this.loggedUser) {
        this.loggedUsername = this.loggedUser.username;
        this.loadCircleUsers(this.loggedUsername);
    }
  } 

  loadCircleUsers(entityId: string){
    this.userService.getCircleUsers(entityId)
    .subscribe((response) => {
      this.circleUsers = response;
      console.log('loadCircleUsers response data ', this.circleUsers);
      
    }); 

  }

}
