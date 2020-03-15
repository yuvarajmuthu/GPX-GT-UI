import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';
import { IfStmt } from '@angular/compiler';
import { Legislator } from 'src/app/models/legislator';


@Component({
  selector: 'app-userbiodatatemplate',
  templateUrl: './userbiodatatemplate.component.html',
  styleUrls: ['./userbiodatatemplate.component.css']
})
export class UserbiodatatemplateComponent extends AbstractTemplateComponent  implements OnInit{ 
  //userId = "u001";
  //legisId:string = "";
  id = "upCongressLegislatorExternal";
  profileDataId:string = "";
  profileIcon = "person";
  firstName:string = "";//"Pennsylvania's 14th congressional district";
  lastName:string = "";//"Pennsylvania's 14th congressional district includes the entire city of Pittsburgh and parts of surrounding suburbs. A variety of working class and majority black suburbs located to the east of the city are included, such as McKeesport and Wilkinsburg. Also a major part of the district are number of middle class suburbs that have historic Democratic roots, such as Pleasant Hills and Penn Hills. The seat has been held by Democrat Mike Doyle since 1995. In the 2006 election, he faced Green Party candidate Titus North and returned to the house with 90% of the vote.";
  userName:string = "";
  emailId = "";
  imageUrl:string = "";
  
  data = {};
  biodata={};
  private userData = {};
  public profilesData = [];
  public profilesTemplates = [];
  isProfileInEditMode:boolean = false;
  private templateProperties = []; 
  private templateData = [];
  group:FormGroup;
  biodataTemplateForm: FormGroup;
  externalUser:boolean;

  //isEditable:boolean = false;

  //legislator: Legislator;
  //resultop:any;
  //keys = [];
  
  
  //called before ngOnInit()
  constructor(private legislatorsService2:LegislatorService, 
    private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private missionService2: ComponentcommunicationService,
    private changeDetector : ChangeDetectorRef,
    private fbuilder: FormBuilder) { 
  
      super(legislatorsService2, dataShareService2, missionService2);
  
      console.log("constructor() userProfile.template");      

      //OBSOLETE?
      missionService2.missionAnnounced$.subscribe(
      mission => {
        console.log("Received save Profile message from parent for district " + mission);
  
        this.saveProfile();
      });

      missionService2.userProfileEditChanged$.subscribe(
        data => {
          console.log("Received user profile edit status " + data);
          this.isProfileInEditMode = data;
          this.changeDetector.detectChanges();

          if(!data){//Save or Cancel Edit Profile ????
            this.saveProfile();
          }

        });

      //this.loadTemplateData();  
      //OVERRIDE KEYS - CUSTOMIZED DISPLAY
      //this.loadDisplayProperties();
      //let structForm = this.createFormGroup();
      //console.log("structForm ", structForm);
      
      //this.biodataTemplateForm = this.group = this.fbuilder.group(JSON.parse(structForm));
      //this.biodataTemplateForm = this.group = this.fbuilder.group(structForm); 
      //this.createFormGroup();
      //console.log("this.biodataTemplateForm ", this.biodataTemplateForm);
  
  
    }

    //called after the constructor
  ngOnInit(): void {
    console.log("ngOnInit() userbiodatatemplate.component");
    if(this.viewingUser['external']){
      this.externalUser = true;  
    }

    this.loadDisplayProperties();     
  
    this.loadTemplateData();   
  }
    
    loadDisplayProperties(){ 
      for (let profileTemplates of this.viewingUser['profileTemplates']){ 
        //console.log("reading template component properties: ", profileTemplates['profile_template_id']);
        //this.templateType.push(profileData['profile_template_id']);
        if(this.id == profileTemplates['profileTemplateId']){
          this.displayProperties = profileTemplates['properties'];
          break;  
        }
      } 
  
    } 
  
    loadTemplateData(){
      let userType:string = this.externalUser?"external": "internal";
      this.userService2.getBiodata(this.profileUserId, userType)
      .subscribe((response) => {
        this.profileDataId = response['id'];
        this.biodata= response['data'];
        
        console.log('biodata response data ', this.biodata);
        
        this.createFormGroup();
      });  
    }

    /*
    allowed():boolean{
        let permission:boolean = this.dataShareService2.checkPermissions();  
        return permission;
    }
    */

    createFormGroup() {
      this.biodataTemplateForm = this.fbuilder.group({});

      this.displayProperties.forEach((element, index) => {
        let value = this.biodata[element['propId']];
        this.biodataTemplateForm.setControl(element['propId'], new FormControl(value));
      });
      this.changeDetector.detectChanges();
    }

    getFormData():any{
      console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.biodataTemplateForm.value));
      const result: Legislator = Object.assign({}, this.biodataTemplateForm.value);
      console.log("Biodata form ", result);
      return result;
    }

    //GET TEMPLATE FORM DATA
    //SHOULD GET FORM DATA, INSTEAD OF PREVIOUSLY LOADED STATIC OBJECT DATA
    getData():string{ 
      let data = {};
  
      this.displayProperties.forEach(element => {
        data[element['propId']] = this.biodata[element['propId']];
      });

      return JSON.stringify(data);
    }
  
    saveProfile(){
      this.data["id"] = this.profileDataId; //primary key
      this.data["profileTemplateId"] = this.id; //unique key
      this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
      this.data["data"] = this.getFormData();
      console.log("Data " + JSON.stringify(this.data));
      this.userService2.updateProfileData(this.data).subscribe((response) => {
        console.log('Profile updated sucessfully');
        this.isProfileInEditMode = false;
        this.biodata = this.data["data"];
        this.changeDetector.detectChanges();

      } 
      );

    }

    editProfile(){
      this.isProfileInEditMode = true;  
    }
    
    cancelEditProfile(){
      this.isProfileInEditMode = false;
      
      //Restoring old values
      this.createFormGroup();


    }

    deleteProfile(){

    }

  }
