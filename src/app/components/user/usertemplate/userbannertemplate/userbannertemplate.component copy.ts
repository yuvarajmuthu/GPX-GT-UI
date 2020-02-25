import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';

@Component({
  selector: 'app-userbannertemplate',
  templateUrl: './userbannertemplate.component.html',
  styleUrls: ['./userbannertemplate.component.css']
})
export class UserbannertemplateComponent extends AbstractTemplateComponent implements OnInit {

  id = "upDefault";
  //firstName:string = "";
  //lastName:string = "";
  //userName:string = "";
  //emailId = "";
  //imageUrl:string = "https://unsplash.it/975/300";
  //profileImageUrl:string;
  //legislator: Legislator;
  firstName1 = new FormControl('');
  lastName1 = new FormControl('');
  data = {};
  private userData = {};
  public profilesData = [];
  public profilesTemplates = [];
  private templateProperties = [];
  private templateData = [];
  followers:number = 0;
  connections:number = 0;
  isCreateMode:boolean = false;
  
  following:boolean = false;
  requestedToFollow:boolean = false;
  followRequestRejected:boolean = false;
  
  ngOnInit(): void {
    console.log("ngOnInit() userProfile.template TemplateLegisUserDefaultComponent");   
  
    if(this.viewingUser['operation'] == "CREATE"){
      this.loadTemplate(this.viewingUser['operation']);      
      this.followers = 0;
      this.isCreateMode = true;
    }else{
      //LEGISLATORs
      if (this.viewingUser['isLegislator'] && this.viewingUser['externalData']){
        console.log("this.viewingUser['externalData']['id'] ", this.viewingUser['externalData']['id']);
  
  
      }else{//Users
        this.loadTemplateDataV1();
      }
  
      //get CONNECTIONS count
      if(this.viewingUser['connections']){
        this.connections = this.viewingUser['connections'].length;
      }
  
      this.getRelation("user", this.profileUserId);
  
      //get FOLLOWERS count
      if(this.viewingUser['followers']){
        this.followers = this.viewingUser['followers'].length;
      }
    } 
  }
    
  constructor(private legislatorsService1:LegislatorService, 
    private userService1:UserService, 
    private dataShareService1:DatashareService, private missionService1: ComponentcommunicationService) {
      super(legislatorsService1, dataShareService1, missionService1);
  
      missionService1.missionAnnounced$.subscribe(
      mission => {
        console.log("Received save Profile message from parent for district " + mission);
  
        this.saveProfile();
      });
  
      //this.loadTemplateData();  
      //this.firstName = 'first';//this.legislator.getFirstName();
      //this.lastName = 'last';//this.legislator.getLastName();
  
    //console.log("constructor() userProfile.template TemplateLegisUserDefaultComponent * " + legislator);   
  
  
    }
  
    getRelation(entity:string, profileId:string){
      this.requestedToFollow = false;
      this.following = false;
      this.followRequestRejected = false;
      var isProfileRelated = false;
  
      console.log("this.viewingUser['connections'].length ", this.viewingUser['connections'].length);
  
      this.viewingUser['connections'].forEach(connection => {
        if((entity === "user" && connection["users"]) ||
           (entity === "group" && connection["groups"]) ||
           (entity === "position" && connection["positions"])){
  
          let connectedEntities = null;
          if((entity === "user" && connection["users"])){
            connectedEntities = connection["users"];
           }else if((entity === "group" && connection["groups"])){
            connectedEntities = connection["groups"];
           }else if((entity === "position" && connection["positions"])){
            connectedEntities = connection["positions"];
           }
          
          connectedEntities.forEach(connectedEntity => {      
            if(connectedEntity["entityId"] === profileId){
              isProfileRelated = true;
  
              if(connectedEntity["connectionStatus"] == "REQUESTED"){
                this.requestedToFollow = true;
              }else if(connectedEntity["connectionStatus"] == "FOLLOWING"){
                this.following = true;
              }else if(connectedEntity["connectionStatus"] == "REJECTED"){
                this.followRequestRejected = true;
              }
  
            }
  
            if(isProfileRelated){
              //exit the for loop
            }
          });
          //exit the for loop
        }
      });
    }
    
    //load the TEMPLATE for CREATE process
    loadTemplate(operation:string){
      //getting the available profile templates for this user type
      this.profilesTemplates = this.viewingUser['profileTemplates'];
      console.log("loadTemplate()::userprofile.template - profile templates: ", this.profilesTemplates);
      for (let profileTemplates of this.profilesTemplates){
        console.log("loadTemplate()::userprofile.template - reading template component properties: ", profileTemplates['profile_template_id']);
        //this.templateType.push(profileData['profile_template_id']);
        if(this.id == profileTemplates['profile_template_id']){
          this.templateProperties = profileTemplates['properties'];
          break;  
        }
      }
  
  
      for (let property of this.templateProperties){
        console.log("loadTemplate()::userprofile.template - Template property " + property);
        this[property] = "TEST";
      }      
      /*
        this.userService1.getUserData(operation).subscribe(
          data => {
          this.userData = data;
          console.log("loadTemplate()::userprofile.template - User data from service: ", this.userData);
  
  
            //getting the available profile templates for this user type
            this.profilesTemplates = this.userData['profile'];
            console.log("loadTemplate()::userprofile.template - profile templates: ", this.profilesTemplates);
            for (let profileTemplates of this.profilesTemplates){
              console.log("loadTemplate()::userprofile.template - reading template component properties: ", profileTemplates['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileTemplates['profile_template_id']){
                this.templateProperties = profileTemplates['properties'];
                break;  
              }
            }
  
  
            for (let property of this.templateProperties){
              console.log("loadTemplate()::userprofile.template - Template property " + property);
              this[property] = "TEST";
            }
  
          }
      );
      */
    }
  
    loadTemplateDataV1(){
            for (let profileTemplate of this.viewingUser['profileTemplates']){
              console.log("reading template component properties: ", profileTemplate['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileTemplate['profile_template_id']){
                this.templateProperties = profileTemplate['properties'];
                break;  
              }
            }
  
  
            //getting the data for this user profile
            for (let profileData of this.viewingUser['profilesData']){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileData['profile_template_id']){
                this.templateData = profileData['data'];
                break;  
              }
            }
  
            for (let dataObj of this.templateData){
              let keys = [];
              keys = Object.keys(dataObj);
              console.log("Template data keys " + keys[0] + ":" + dataObj[keys[0]]);
              //this[keys[0]] = dataObj[keys[0]];
              for (let key of keys){
                this[key] = dataObj[key];
              }
            }
  
    }
  
  /*DEPRECATED - NOT BEING USED*/
    loadTemplateData(){
        this.userService1.getUserData(this.profileUserId, false).subscribe(
          data => {
          this.userData = data;
          console.log("User data from service: ", this.userData);
  
  
            //getting the available profile templates for this user type
            this.profilesTemplates = this.userData['profile'];
            console.log("profile templates: ", this.profilesTemplates);
            for (let profileTemplates of this.profilesTemplates){
              console.log("reading template component properties: ", profileTemplates['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileTemplates['profile_template_id']){
                this.templateProperties = profileTemplates['properties'];
                break;  
              }
            }
  
  
            //getting the data for this user profile
            this.profilesData = this.userData['profileData'];
            console.log("profile data: ", this.profilesData);
  
            for (let profileData of this.profilesData){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileData['profile_template_id']){
                this.templateData = profileData['data'];
                break;  
              }
            }
  
            for (let dataObj of this.templateData){
              let keys = [];
              keys = Object.keys(dataObj);
              console.log("Template data keys " + keys[0] + ":" + dataObj[keys[0]]);
              this[keys[0]] = dataObj[keys[0]];
            }
  
          }
      );
  
    }
  
    followPerson(){
  
      var followURequest = {};      
      followURequest["userId"] = this.dataShareService1.getCurrentUserId();
      followURequest["connectionUserId"] = this.profileUserId;
      followURequest["status"] = "REQUESTED";            
      console.log("Profile data " + JSON.stringify(followURequest));      
  
      this.userService1.followPerson(JSON.stringify(followURequest))
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
    }
  
    allowed():boolean{
        let permission:boolean = this.dataShareService1.checkPermissions();
        //console.log("allowed() from userProfile.template TemplateLegisUserDefaultComponent - " + permission);
  
        return permission;
    }
  
    getData():string{
      let data = {};
      data["firstName"] = this.firstName;
      data["lastName"] = this.lastName;
  
  
      let dataString:string = JSON.stringify(data);
      console.log("TemplateIntroductionComponent data " + dataString);
      return dataString;
    }
  
    saveProfile(){
      this.data["profile_template_id"] = this.id;
      this.data["user_id"] = this.profileUserId;
      this.data["data"] = this.getData();
  
      console.log("Data " + JSON.stringify(this.data));
  
    }
  
}
