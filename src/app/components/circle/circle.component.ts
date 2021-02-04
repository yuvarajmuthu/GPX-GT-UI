import { Component, OnInit } from '@angular/core';

import {Usercard2Component} from '../user/usercard2/usercard2.component';

import {UserService} from '../../services/user.service';
import {DatashareService} from '../../services/datashare.service';
import {ComponentcommunicationService} from '../../services/componentcommunication.service';

import {User} from '../../models/user';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements OnInit {
  loggedUser: User = null;
  loggedUsername: string = null;
  circleUsers:string[] = null;
  circleUserCategories:string[] = null;
  circleUsersInfo:[] = null;
  circleCatagoryActive:string;

  constructor(private userService: UserService,
    private datashareService: DatashareService,
    private communicationService: ComponentcommunicationService
    ) { 
      /*
      communicationService.circleCategoryChanged$.subscribe(
        data => {
            console.log('Received data from communicationService.circleCategoryChanged$.subscribe ', data);
            if(this.circleUserCategories.indexOf(data) < 0){
              this.circleUserCategories.push(data);
            }
        });
        */
  }
 
  ngOnInit() {
    this.loggedUser = this.datashareService.getCurrentUser();
    this.circleUserCategories = [];
    if (this.loggedUser) {
        this.loggedUsername = this.loggedUser.username;
        this.loadCircleUsersInfo(this.loggedUsername);
    }
  } 
  
  loadCircleUsersInfo(username: string){
    console.log('loadCircleUsersCategory by ', username);
    this.userService.getCircleUsersCategory(username)
    .subscribe((response) => {
      this.circleUsersInfo = response;
      console.log('loadCircleUsersInfo response data ', this.circleUsersInfo);
      if(this.circleUsersInfo != null){
        for(let i = 0; i < this.circleUsersInfo.length; i++){
          let obj={};
          obj = this.circleUsersInfo[i];
          let keys = Object.keys(obj);
          this.circleUserCategories.push(keys[0]);
          if(i==0)
            this.loadCircleUsersByCategory(keys[0]);
        }
      }
      
    }); 

  }

  //OBSOLETE
  loadCircleUsers(username: string){
    console.log('circleUser by ', username);
    this.userService.getCircleUsers(username)
    .subscribe((response) => {
      this.circleUsers = response;
      console.log('loadCircleUsers response data ', this.circleUsers);
      
    }); 

  }

  loadCircleUsersByCategory(circleUserCategory: string){
    console.log('circleUserCategory ', circleUserCategory);
    this.circleCatagoryActive = circleUserCategory;
    for(let i = 0; i < this.circleUsersInfo.length; i++){
      let obj={};
      obj = this.circleUsersInfo[i];
      let keys = Object.keys(obj);
      if(keys[0] === circleUserCategory){
        this.circleUsers = obj[circleUserCategory];
      }
    }

/*
    this.userService.getCircleUsers(circleUserCategory)
    .subscribe((response) => {
      this.circleUsers = response;
      console.log('loadCircleUsers response data ', this.circleUsers);
      
    }); 
    */

  }
}
