import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';

@Component({
  selector: 'app-userofficetemplate',
  templateUrl: './userofficetemplate.component.html',
  styleUrls: ['./userofficetemplate.component.css']
})
export class UserofficetemplateComponent extends AbstractTemplateComponent  implements OnInit  {
  id = "upOffices"; 
  profileIcon = "business";
  //roles:any = null;
  offices:JSON[] = [];
  displayProperties = [];
  //role = {};

  constructor(private legislatorsService2:LegislatorService, 
    private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private missionService2: ComponentcommunicationService, 
    private changeDetector : ChangeDetectorRef) {
  
      super(legislatorsService2, dataShareService2, missionService2);
  
      console.log("constructor() userofficetemplate.component");
      
  }

  ngOnInit() {
    console.log("ngOnInit() userofficetemplate.component");
    /*
    this.userService2.getRoles(this.profileUserId).subscribe(
      result => {
        console.log(result.length);
        this.roles = result;
      });
      */
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
  /*
    this.userService2.getRoles(this.profileUserId).subscribe(
      result => {
        console.log(result.length);
        this.roles = result;
        console.log(this.roles);

      });
      this.zone.run(() => {
        this.userService2.getRoles(this.profileUserId).toPromise().then((data) => {
            this.roles= data;
            console.log(this.roles);
        });
        })
*/
//this.zone.run(() => {

        this.userService2.getOffices(this.profileUserId, this.viewingUser["isCongress"])
        .subscribe((data) => {
          //console.log("roles count ", data.length);
          //this.role = JSON.parse(JSON.stringify(data[0]));
          //this.role['term'] = 'term';
          this.offices= data;
          this.changeDetector.detectChanges();
        });
          /*
          data.forEach(element => {
            this.roles.push(JSON.parse(JSON.stringify(element)));
            console.log(this.roles);
            this.role = JSON.parse(JSON.stringify(element));
              
          });
          */
//      });

  //  });
  }

  getData():string{
 /*
    let data = {};
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;


    let dataString:string = JSON.stringify(data);
    console.log("TemplateIntroductionComponent data " + dataString);
    return dataString;
    */
   return "";
  }

}