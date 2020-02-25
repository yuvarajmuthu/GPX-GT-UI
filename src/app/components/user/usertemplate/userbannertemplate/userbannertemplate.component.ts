import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';

@Component({
  selector: 'app-userbannertemplate',
  templateUrl: '../userbiodatatemplate/userbiodatatemplate.component.html',//'./userbannertemplate.component.html',
  styleUrls: ['./userbannertemplate.component.css']
})
export class UserbannertemplateComponent extends AbstractTemplateComponent implements OnInit {

  id = "upDefault";
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

          if(!data){//Save Profile
            this.saveProfile();
          }

        });
  
  
    }

    //called after the constructor
  ngOnInit(): void {
    console.log("ngOnInit() userbiodatatemplate.component");
    if(this.viewingUser['external']){
      this.externalUser = true;  
    }

    this.loadDisplayProperties();     
  
    this.loadTemplateData();   
    this.biodataTemplateForm = this.fbuilder.group({});

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
      this.userService2.getBiodata(this.profileUserId, "internal")
      .subscribe((response) => {
        this.biodata= response['data'];
        console.log('biodata response data ', this.biodata);
        this.changeDetector.detectChanges();
      });

      /*
        this.userService2.getUserData(this.profileUserId, true).subscribe(
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
      */
  
    }
  
    allowed():boolean{
        let permission:boolean = this.dataShareService2.checkPermissions();
        //console.log("allowed() - " + permission);
  
        return permission;
    }
/*
    createFormGroup() {
      this.biodataTemplateForm = this.fbuilder.group({});
      let struct:string = "\"{";//"new FormGroup({";
      this.displayProperties.forEach((element, index) => {
        console.log('element[propId] ', element['propId'], ' this.legislator[element[propId]] ', this.legislator[element['propId']]);
        this.biodataTemplateForm.setControl(element['propId'], new FormControl(this.legislator[element['propId']]));
    
    //    let control = new FormControl();
        
        if(index === this.displayProperties.length-1){//last item
          struct = struct + element['propId'] + ": new FormControl()";
        }else{
          struct = struct + element['propId'] + ": new FormControl(),";
        }
        console.log("index " + index);

      });
//      struct = struct + "})";
      struct = struct + "}\"";
      return struct;//JSON.parse(struct);
/*
      return new FormGroup({
        personalData: new FormGroup({
          email: new FormControl(),
          mobile: new FormControl(),
          country: new FormControl()
         }),
        requestType: new FormControl(),
        text: new FormControl()
      });
      
    }
    */
    getDisplay(){
      console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.biodataTemplateForm.value));
      //const result: Legislator = Object.assign({}, this.biodataTemplateForm.value);
      //console.log("Legislator form ", result.first_name);

    }
    //GET TEMPLATE FORM DATA
    //SHOULD GET FORM DATA, INSTEAD OF PREVIOUSLY LOADED STATIC OBJECT DATA
    getData():string{ 
      let data = {};
      //data["firstName"] = this.firstName;
      //data["lastName"] = this.lastName;
  
      this.displayProperties.forEach(element => {
        //console.log("Property ", element['propId']);
        //console.log("Property value", this.legislator[element['propId']]);  
        data[element['propId']] = this.legislator[element['propId']];
      });

      let dataString:string = JSON.stringify(data);
      console.log("TemplateIntroductionComponent data " + dataString);
      return dataString;
    }
  
    saveProfile(){
      this.data["profile_template_id"] = this.id;
      this.data["username"] = this.profileUserId; // how about for user updating other passive profile ?
      this.data["data"] = this.getData();


      console.log("Data " + JSON.stringify(this.data));
  //save
    }
  
}
