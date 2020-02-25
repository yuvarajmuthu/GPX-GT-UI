import { Component, OnInit, ComponentRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';
import { LegislatorService } from '../../../services/legislator.service';
import { ComponentcommunicationService }     from '../../../services/componentcommunication.service';
import { AlertService } from '../../../services/alert.service';
import {GroupService} from '../../../services/group.service'; 

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  profileEditOption:string;

  constructor(
    private groupService:GroupService, 
    //private elementRef:ElementRef, 
    //private renderer: Renderer, 
    //private peopleService: PeopleService, 
    //private partyService: PartyService, 
    
    private route: ActivatedRoute, 
    private userService:UserService, 
    private missionService: ComponentcommunicationService, 
    private legislatorsService:LegislatorService, 
    private datashareService:DatashareService
    
    ) {  
  //   console.log("constructor()::GroupComponent");
  //   //listens for any templatepopulationcomponent addition
  //   missionService.missionNewProfileTemplateAdded$.subscribe(
  //   mission => {
  //     console.log("Received templatepopulationcomponent init message");
  //     this.populationComponent = mission;
  // });      
}

ngOnInit(){
  console.log("ngOnInit()::GroupComponent");
  this.profileEditOption = this.getPermission(); 

  let id = this.route.snapshot.paramMap.get('id');

  if(id){
    this.viewingDistrict['id'] = id;
    this.operation = this.viewingDistrict['id'];
    console.log("from ngOnInit()::constitutionProfile Param value - id " + this.operation);
  }

  let externalId = this.route.snapshot.paramMap.get('id');
  if(externalId){
    this.viewingDistrict['externalId'] = externalId;
    //this.operation = this.viewingDistrict['externalId'];
    console.log("from ngOnInit()::constitutionProfile Param value - externalId " + this.viewingDistrict['externalId']);

  }


  if(this.operation == "CREATE"){
//      this.loadProfileTemplate();      
    this.datashareService.setPermission("Editor");   

    this.groupService.getGroupData(this.operation,'').subscribe(
        data => {
          this.groupData = data;
          console.log("Group data from service: ", this.groupData);

          //getting the available profile templates for this group type
          this.viewingDistrict['profileTemplates'] = this.profilesTemplates = this.groupData['profile'];
          console.log("profile templates: ", this.profilesTemplates);

          this.datashareService.setViewingDistrict(this.viewingDistrict);


          console.log("this.viewingDistrict['profileTemplates']" + this.viewingDistrict['profileTemplates']);
          if(this.viewingDistrict['profileTemplates']){
                for (let profileTemplate of this.viewingDistrict['profileTemplates']){
                  console.log("reading profileTemplates properties: " + profileTemplate['profileTemplateId']);
                  if("districtIntroTemplate" == profileTemplate['profileTemplateId']){
                    let templateProperties = [];
                    templateProperties = profileTemplate['properties'];

                    for (let property of templateProperties){
                      console.log("Template property " + property);
                      this[property] = "Enter data here";
                    }

                    break;  
                  }
                }
          }

        }
    );
  }else{
    this.loadData();
  }

}

  //@ViewChild('staticTabs') staticTabs: TabsetComponent; 
	public isCollapsed:boolean = true;
	public isCMCollapsed:boolean = true;
	public isPartiesCollapsed:boolean = true;

	public electedPersonsOld=[];
  public electedPersons:Array<any>=[];
	public contestedPersons=[];
	public parties=[];
  templateType = [];
  private componentRef: ComponentRef<{}>;
  private groupData = {};
  public profilesTemplates = [];
  public profilesData = [];
  private viewingDistrict={};  
  public connected:boolean = false;
  //posts:Post[] = [];
  operation:string = "";
  followers:number = 0;
  activities:number = 0;

  // @ViewChild(TemplateIntroductionComponent) introductionComponent: TemplateIntroductionComponent;        
  // @ViewChild(TemplatePopulationComponent) populationComponent: TemplatePopulationComponent;
  // @ViewChild(TemplateBusinessComponent) businessComponent: TemplateBusinessComponent;  
  // @ViewChild(DynamicContentComponent) dynamicComponent: DynamicContentComponent;

  

  //get invoked automatically before ngOnInit()
  routerOnActivate(): void {
    // if(this.routeSegment.getParam("id")){
    //   this.viewingDistrict['id'] = this.routeSegment.getParam("id");
    //   this.operation = this.viewingDistrict['id'];
    //   console.log("from routerOnActivate()::constitutionProfile Param value - id " + this.operation);
    // }

    // if(this.routeSegment.getParam("externalId")){
    //   this.viewingDistrict['externalId'] = this.routeSegment.getParam("externalId");
    //   //this.operation = this.viewingDistrict['externalId'];
    //   console.log("from routerOnActivate()::constitutionProfile Param value - externalId " + this.viewingDistrict['externalId']);

    // }

  }
  

  setValue(jsonData) {
      console.log(' saved! the obj  - ' + JSON.stringify(jsonData));
      for(var key in jsonData){
        if(jsonData.hasOwnProperty(key)){
          this[key] = jsonData[key];
          console.log('New value  - ' + key + " - " + this[key]);
        }
      }
  }

//called with district id
  loadData(){
      //this.parties = this.partyService.getPartiesByParam('');
      //this.connected = this.userService.getRelation(this.dataShareService.getCurrentUserId(), this.dataShareService.getViewingDistrict()['id']);
      //this.getRelation();

      //GETTING PROFILE DATA
      this.groupService.getGroupData(this.operation, this.viewingDistrict['externalId']).subscribe(
          data => {
            this.groupData = data;
            console.log("Group data from service: ", this.groupData);

          let profileStr = JSON.parse('[{"profileTemplateId":"districtIntroTemplate","name":"Introduction"},{"profileTemplateId":"districtPopulationTemplate","name":"Population"},{"profileTemplateId":"districtBusinessTemplate","name":"Popular Business"}]');
          
            //getting the available profile templates for this group type
            this.viewingDistrict['profileTemplates'] = this.profilesTemplates = this.groupData['profile'];
            this.viewingDistrict['profileTemplates'] = this.profilesTemplates = profileStr;           
            console.log("profile templates: ", this.profilesTemplates);

            //getting the data for this group profile
            this.viewingDistrict['profilesData'] = this.profilesData = this.groupData['profileData'];
            console.log("profile data: ", this.profilesData);

            //getting the data for this group activities
            //SHALL BE REFACTORED TO GET THIS DATA FROM POSTSERVICE
            //this.posts = this.viewingDistrict['activities'] = this.groupData['activities'];
            //console.log("profile activities: ", this.viewingDistrict['activities']);

            //identifying the profile selected for this group profile, so those components shall be loaded
            let compTypes = [];
            for (let profileData of this.profilesData){
              console.log("loading template component1: ", profileData['profileTemplateId']);
              //this.templateType.push(profileData['profile_template_id']);
              

              //display the intro template data - districtIntroTemplate
              console.log("profileData['profileTemplateId'] " + profileData['profileTemplateId']);

              if("districtIntroTemplate" == profileData['profileTemplateId']){
                for (let dataObj of profileData['data']){
                  let keys = [];
                  keys = Object.keys(dataObj);
                  console.log("Template data keys " + keys[0] + ":" + dataObj[keys[0]]);
                  this[keys[0]] = dataObj[keys[0]];
                }
              }else{
                console.log("Adding dynamic Template");              
                compTypes.push(profileData['profileTemplateId']);
              }

            }

            if(compTypes.length > 0){
              this.templateType = compTypes;
            }

            //setting here so it can be accessed globally
            this.viewingDistrict['id'] = this.operation;//this.groupData['id'];
            this.datashareService.setViewingDistrict(this.viewingDistrict);

            this.getRelation();

            //TODO: GET FOLLOWERS COUNT

          }
      );

      //GETTING CURRENT REPRESENTATIVES DATA
      this.getCurrentRepresentatives("byCongressDistrict");

  }

  loadProfileTemplate(){
      //GETTING PROFILE DATA
      this.groupService.getGroupData('','').subscribe(
          data => {
            this.groupData = data;
            console.log("Group data from service: ", this.groupData);

            //getting the available profile templates for this group type
            this.viewingDistrict['profileTemplates'] = this.profilesTemplates = this.groupData['profile'];
            console.log("profile templates: ", this.profilesTemplates);

            this.datashareService.setViewingDistrict(this.viewingDistrict);

          }
      );


  }
/*
  @ViewChild('district-population')
  set populationComponent(content:TemplatePopulationComponent) {
    console.log('setting viewchild ' + content);
    //this.populationComponent = content;
 }
 */


  

/*
      set populationTemplate(v: TemplatePopulationComponent) {
        console.log("set populationTemplate() " + v);
        setTimeout(() => { this.populationComponent = v }, 100);
      }


  
    ngOnChanges(){
        console.log('constitutionProfile ngOnChanges() ');
    }
*/
    showActivities(){
      console.log("show activities ");  
    }

/*getActivities(){
  console.log('consitutionProfile getActivities()');

}
*/
getCurrentRepresentatives(type:string){
  //let legislator = {};

  let searchParam:string = "ocd-division/country:us/state:pa/cd:6";
    //this.legislators = [];
    this.legislatorsService.getLegislature(searchParam, type)
    //.map(result => this.resultop = result.results)
    .subscribe((result) => {
      console.log("result for type " + type + JSON.stringify(result));
      if(type == 'byCongressDistrict'){
        if(!result['error']){
          let offices = [];
          offices = result['offices'];
          
          let officials = [];
          officials = result['officials'];

         for(var i = 0;i<officials.length;i++) {
           let legislator = {};
           if(offices[i] && offices[i]['name'] && 
             (offices[i]['name'].indexOf('United States Senate') != -1 || 
               offices[i]['name'].indexOf('United States House of Representatives') != -1)){
          // console.log("offices[i]['name'] " + offices[i]['name']);
         //console.log("offices[i]['name'].indexOf('United States Senate') " + offices[i]['name'].indexOf('United States Senate'));
         //console.log("offices[i]['name'].indexOf('United States House of Representatives') " + offices[i]['name'].indexOf('United States House of Representatives'));
         //console.log("flag " + (offices[i]['name'] && 
          //   (offices[i]['name'].indexOf('United States Senate') != -1 || offices[i]['name'].indexOf('United States House of Representatives') != -1)));

           legislator['full_name'] = officials[i]['name'];
           legislator['party'] = officials[i]['party'];
           legislator['photo_url'] = officials[i]['photoUrl'];  

           if(offices[i]['name'])
             legislator['role'] = offices[i]['name'];

           //STATE
           let division:string = offices[i]['divisionId'];
           if(division.indexOf('state:') != -1){
             legislator['state'] = division.substr(division.indexOf('state:')+6, 2).toUpperCase();
           }

           //CONGRESS DISTRICT
          if(division.indexOf('cd:') != -1){
             legislator['district'] = division.substr(division.indexOf('cd:')+3, 2);
           }

          if(offices[i]['roles'] && offices[i]['roles'].length > 0){
            legislator['chamber'] = offices[i]['roles'][0];
          }

          console.log("legislator " + legislator);
          this.electedPersons.push(legislator);
          console.log("this.electedPersons.length " + this.electedPersons.length);
          //this.legislator = legislator;
          }
         }
       }
       else{
         console.log('Error in getting');
         //this.alertService.error('Error in getting data');
       }
      }

           

            },
            (error)=>{
              console.log('Error in getting data');
            });

  
}

saveProfile(){

    if(this.operation == "CREATE"){
      console.log("Creating Group Profile");
      this.createProfile();
    }else{
      console.log("Saving Group Profile");
      this.updateProfile(this.operation);
    }


}

createProfile(){
      var profileRequest = {};      
      var profile = {};      
      var profilesData = [];
      var templateData = [];
////
      let property = {};
      property["name"] = this["name"];
      templateData.push(property);

      property = {};
      property["description"] = this["description"];
      templateData.push(property);
      
      profile["profileTemplateId"] = "districtIntroTemplate";      
      profile["data"] = templateData;

      profilesData.push((profile));
////
      // if(this.populationComponent){
      //   profilesData.push(JSON.parse(this.populationComponent.getData()));
      // }

///
      profileRequest["groupName"] = this["name"];
      profileRequest["groupLevel"] = "";
      profileRequest["groupType"] = "";            
      profileRequest["parentGroupId"] = "";
      profileRequest["sourceSystem"] = "";
      profileRequest["sourceId"] = "";            

      profileRequest["profileData"] = profilesData;
      console.log("Profile data " + JSON.stringify(profileRequest));      

      this.groupService.createGroup(JSON.stringify(profileRequest))
      .subscribe((result) => {
        console.log("create group response " + result);
      });

}

updateProfile(groupId:string){
      var profileRequest = {};      
      var profile = {};      
      var profilesData = [];
      var templateData = [];
////collecting data from districtIntroTemplate
      let property = {};
      property["name"] = this["name"];
      templateData.push(property);

      property = {};
      property["description"] = this["description"];
      templateData.push(property);
      
      profile["profileTemplateId"] = "districtIntroTemplate";      
      profile["data"] = templateData;

      profilesData.push((profile));
////collecting data from populationTemplate
      // if(this.populationComponent){
      //   profilesData.push(JSON.parse(this.populationComponent.getData()));
      // }

///
      profileRequest["groupName"] = this["name"];
      profileRequest["groupLevel"] = "";
      profileRequest["groupType"] = "";            
      profileRequest["parentGroupId"] = "";
      profileRequest["sourceSystem"] = "";
      profileRequest["sourceId"] = "";            

      profileRequest["profileData"] = profilesData;
      console.log("Profile data " + JSON.stringify(profileRequest));      

      this.groupService.updateGroup(groupId, JSON.stringify(profileRequest))
      .subscribe((result) => {
        console.log("update group response " + result);
      });

}

followDistrict(){
  console.log("followDistrict this.dataShareService.getCurrentUserId() " + this.datashareService.getCurrentUserId() + ", this.datashareService.getViewingDistrict()['id'] " + this.datashareService.getViewingDistrict()['id']);

  var followDRequest = {};      
  followDRequest["userId"] = this.datashareService.getCurrentUserId();
  followDRequest["groupId"] = this.datashareService.getViewingDistrict()['id'];
  followDRequest["status"] = "FOLLOWING";            
  console.log("Profile data " + JSON.stringify(followDRequest));      

  this.userService.followDistrict(JSON.stringify(followDRequest))
  .subscribe((result) => {
    console.log("followDistrict response " + result);
    
    if(result.status == "FOLLOWING")
      this.connected = true;
  });
}

getRelation(){
  var getRelationRequest = {};      
  getRelationRequest["userId"] = this.datashareService.getCurrentUserId();
  getRelationRequest["groupId"] = this.datashareService.getViewingDistrict()['id'];

  console.log("getRelationRequest " + JSON.stringify(getRelationRequest));      

  this.userService.getRelation(this.datashareService.getCurrentUserId(), this.datashareService.getViewingDistrict()['id'])
  .subscribe((result) => {
    console.log("getRelation response " + result);
    
    this.connected = result;

  });
}

ngAfterViewChecked(){
  //console.log("constitutionProfile ngAfterViewChecked()");
  //if(this.elementRef.nativeElement.querySelector('district-population')){
    //console.log("District population template found ");
/*
        this.renderer.listenGlobal('district-population', 'onAdd', (event)=>{
        console.log("onAdd event handled");
    });
    */

   //console.log("adding handler " + (<TemplatePopulationComponent>(this.elementRef.nativeElement.querySelector('district-population'))).femaleCount);
   //this.componentRef = (<TemplatePopulationComponent>(this.elementRef.nativeElement.querySelector('district-population'))).instance;
    //this.elementRef.nativeElement.querySelector('district-population').addEventListener('ngAfterViewInit', this.onAddHandler.bind(this));
  //}
}

onAdd(event){
  //console.log("onAdd event handled");
  //this.populationComponent = event;
}

ngAfterViewInit (){ //not called
  console.log("constitutionProfile ngAfterViewInit ()");
  //this.populationComponent.getData();
  //this.dynamicComponent.allowed();
}

ngAfterContentInit (){ //not called
  //console.log("constitutionProfile ngAfterContentInit ()");
}

  /*
  name:string = 'Royapuram';
  description:string = 'Royapuram is a legislative assembly constituency, that includes the locality, Royapuram. Royapuram assembly constituency is part of Chennai North Parliamentary constituency.';
     
  selected_permission = 'Editor';
  checkPermissions() {
      if(this.selected_permission == 'Editor') {
        return true;
      } 
      else {
        return false;
      }
    }

        saveMethod(obj) {
      console.log('trying to save'+ JSON.stringify(obj));
    }
*/ 




      getPermission():string{
                //console.log("calling getter");
          let data = this.datashareService.getPermission();
      //console.log("getPermission() " + data);
      return data;
  }

  setPermission(data:string){
      //console.log("calling setter");
      this.datashareService.setPermission(data);    
 
  }


  allowed():boolean{
      let permission:boolean = this.datashareService.checkPermissions();
      //console.log("allowed() - " + permission);

      return permission;
  }

  loadTemplate(type:string){
    console.log("constitutionProfile Loading Template " + type);
    let compTypes = [];
    compTypes.push(type);
    this.templateType = compTypes;
  }



	getElectedMembers(type:String){
		//this.electedPersons = this.peopleService.getElectedMembers(type);
		//return this.electedPersons;
	}

	saidHello($event){
	  alert(`You said hello to ${$event}`)
	}


  //START Ratings Component
  public x:number = 5;
  public y:number = 2;
  public max:number = 10;
  public rate:number = 7;
  public isReadonly:boolean = false;
 
  public overStar:number;
  public percent:number;
 
  public ratingStates:any = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];
 
  public hoveringOver(value:number):void {
    this.overStar = value;
    this.percent = 100 * (value / this.max);
  };
 
  public resetStar():void {
    this.overStar = void 0;
  }
  //END Ratings Component
 
}
