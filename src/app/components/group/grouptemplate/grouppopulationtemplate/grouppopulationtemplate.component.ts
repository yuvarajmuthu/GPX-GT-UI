import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, EmbeddedViewRef, ViewRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {ProfileService} from '../../../../services/profile.service';

import {AbstractTemplateGroupComponent} from '../../abstractTemplateGroupComponent'; 

@Component({
  selector: 'app-grouppopulationtemplate',
  templateUrl: './grouppopulationtemplate.component.html',
  styleUrls: ['./grouppopulationtemplate.component.css']
})
export class GrouppopulationtemplateComponent extends AbstractTemplateGroupComponent implements OnInit {

  ngOnInit() {
  }

  obj:any=GrouppopulationtemplateComponent;
  id:string = "districtPopulationTemplate";
//population:string = "100000";
//maleCount:string = "40000";
//femaleCount:string = "55000";
//othersCount:string = "5000";
@Input() show:boolean = true;
@Output() onAdd = new EventEmitter<GrouppopulationtemplateComponent>();

  @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>; 

view:EmbeddedViewRef<GrouppopulationtemplateComponent>; 

constructor(private profileService:ProfileService, 
  private dataShareService3:DatashareService, 
  private missionService: ComponentcommunicationService) {
    super(dataShareService3);

    missionService.missionAnnounced$.subscribe(
    mission => {
      console.log("Received save Profile message from parent for district " + mission);
      //console.log("Data " + this.getData()); 
  });

  this.loadTemplateData(this.id);  

}

  loadTemplateData(id:string){

       //getting the available profile templates for this group type
          console.log("loadTemplateData() for template: " +  id);
          //TODO
          //call profile service to get the template data
    this.profileService.getProfileTemplateData(id)
    .subscribe((result) => {
      console.log("profile template response " + result[0]);
      this.templateProperties = result[0]['properties'];

    });



          //getting the data for this group profile
         if(this.viewingDistrict['profilesData']){ 
          for (let profileData of this.viewingDistrict['profilesData']){
            console.log("reading profileData properties: " +  profileData['profileTemplateId']);
            //this.templateType.push(profileData['profile_template_id']);
            if(id == profileData['profileTemplateId']){
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
  

  }

//notify when templatepopulationcomponent is added, 
//so an instance would be added to constitutionProfile and would be used for saving the profile
ngAfterViewInit(){
console.log("ngAfterViewInit() TemplatePopulationComponent");
//this.missionService.newProfileTemplateAddedMission(this);

}


  allowed():boolean{
      let permission:boolean = this.dataShareService3.checkPermissions();
      //console.log("allowed() - " + permission);

      return permission;
  }
  
  public getData():string{
    let data = {};
    var templateData = [];

    for (let key of this.templateProperties){
      let property = {};
      //console.log("Key " + key);
      if(this[key]){
        property[key] = this[key];
      }else{
        property[key] = '';          
      }
      templateData.push(property);        
    }

    data["profileTemplateId"] = this.id;      
    data["data"] = templateData;

    let dataString:string = JSON.stringify(data);
    console.log("TemplatePopulationComponent data " + JSON.stringify(dataString));
    return dataString;
  }

  removeTemplateData(){
    let vRef:ViewRef = this.dataShareService.getDistrictView(this.obj);
    //this.missionService.removeProfileTemplateMission(vRef);
    //this.missionService.newProfileTemplateAddedMission(null);
  }
}
