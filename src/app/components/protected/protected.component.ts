import {Component, ViewContainerRef, ViewChild, ElementRef, Renderer, ChangeDetectorRef, ComponentRef, Input, OnInit, isDevMode} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Legislator } from '../../models/legislator';
import {User} from '../../models/user'; 

//import {UsertemplateComponent} from 'usertemplate/usertemplate.component';

import {DatashareService} from '../../services/datashare.service';
import {UserService} from '../../services/user.service';
import { LegislatorService } from '../../services/legislator.service';
import { ComponentcommunicationService }     from '../../services/componentcommunication.service';
import { AlertService } from '../../services/alert.service'; 


@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent implements OnInit {
  loggedUser:User = null;
  profileUserId:string = null;
  viewingUser={}; 
  isLegislator:boolean;

  constructor(private  router: Router,
    private route: ActivatedRoute,
    private userService:UserService, 
    private missionService: ComponentcommunicationService, 
    private legislatorsService:LegislatorService, 
    private datashareService:DatashareService) {  
      this.loggedUser = this.datashareService.getCurrentUser();  
      

  }
  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      if(params['followEntityId'] != null){
        this.profileUserId = params['followEntityId'];
        this.isLegislator =  params['isLegislator'];
        this.followEntity();
      }
      this.loggedUser = this.datashareService.getCurrentUser();
    

      

   });

  }

  followEntity(){
    if(!this.loggedUser.username){
      let routePath:string = "/secure";
      this.router.navigate([routePath]);

      this.router.navigate([routePath, {followEntityId:this.profileUserId}]);

    }

    var followURequest = {};
    var sourceEntity={};
    var targetEntity={}; 
    
    /*MAY NOT BE REQUIRED - BEGIN */
    followURequest["userId"] = this.loggedUser.username;// this.datashareService.getCurrentUserId();
    followURequest["connectionUserId"] = this.profileUserId;
    /*MAY NOT BE REQUIRED - END */

    followURequest["sourceEntityId"] = this.loggedUser.username;//this.datashareService.getCurrentUserId();
    followURequest["sourceEntityType"] = "USER";
    followURequest["targetEntityId"] = this.profileUserId;
    
    if(this.isLegislator){
      followURequest["targetEntityType"] = "LEGISLATOR";
    }else{
      followURequest["targetEntityType"] = "USER";
    }
    followURequest["status"] = "REQUESTED";            
    console.log("Profile data " + JSON.stringify(followURequest));      
/*
    this.userService.followPerson(JSON.stringify(followURequest))
    .subscribe(
      (result) => {
          console.log("followDistrict response " + result);

          if(result.status == "REQUESTED"){
            this.requestedToFollow = true;
          }else if(result.status == "FOLLOWING"){
            this.following = true;
          }else if(result.status == "REJECTED"){
            this.followRequestRejected = true; 
          }

        },
      (err) => {
        console.log("Error ", err);
      });
      */
  }
}
