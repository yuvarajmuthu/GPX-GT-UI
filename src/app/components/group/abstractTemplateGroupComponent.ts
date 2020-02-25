import {DatashareService} from '../../services/datashare.service';
import {ComponentcommunicationService}     from '../../services/componentcommunication.service';
import {UserService} from '../../services/user.service';
import { LegislatorService } from '../../services/legislator.service';

import { Legislator } from '../../models/legislator';


export abstract class AbstractTemplateGroupComponent { 

context: any;
public viewingDistrict={};
public templateProperties = [];
public templateData = [];

//  @ViewChild('staticTabs') staticTabs: TabsetComponent;

constructor(public dataShareService:DatashareService) {
  this.viewingDistrict = this.dataShareService.getViewingDistrict();
}

abstract getData():string;

  setValue(jsonData) {
      console.log(' saved! the obj  - ' + JSON.stringify(jsonData));
      for(var key in jsonData){
        if(jsonData.hasOwnProperty(key)){
          this[key] = jsonData[key];
          console.log('New value  - ' + key + " - " + this[key]);
        }
      }
  }

  loadTemplateData(id:string){

       //getting the available profile templates for this group type
          console.log("loadTemplateData() for template: " +  id);
          //TODO
          //call profile service to get the template data
          /*
    this.groupService.updateGroup(groupId, JSON.stringify(profileRequest))
    .subscribe((result) => {
      console.log("update group response " + result);
    });
    */

          for (let profileTemplate of this.viewingDistrict['profileTemplates']){
            console.log("reading profileTemplates properties: " + profileTemplate['profileTemplateId']);
            console.log("JSON.stringify(this.viewingDistrict['profileTemplates'])" + JSON.stringify(this.viewingDistrict['profileTemplates']));
            //this.templateType.push(profileData['profileTemplateId']);
            if(id == profileTemplate['profileTemplateId']){
              this.templateProperties = profileTemplate['properties'];
/*
              for (let property of this.templateProperties){
                console.log("Template property name " + property);
                this[property] = "";
              }
*/
              break;  
            }
          }


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
}
    