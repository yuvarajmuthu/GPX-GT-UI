import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';
import { LegislatorService } from '../../../../services/legislator.service';

import { Observable} from 'rxjs';


@Component({
  selector: 'app-userroletemplate',
  templateUrl: './userroletemplate.component.html',
  styleUrls: ['./userroletemplate.component.css']
})

export class UserroletemplateComponent  extends AbstractTemplateComponent  implements OnInit  {
  id = "upRole";
  profileIcon = "group";
  //roles:any = null;
  roles:JSON[] = [];
  displayProperties = [];
  //role = {};
  viewingUser={}; 
  roleTemplateForm: FormGroup;

  constructor(private legislatorsService2:LegislatorService, 
    private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private missionService2: ComponentcommunicationService, 
    private changeDetector : ChangeDetectorRef,
    private fbuilder: FormBuilder) {
  
      super(legislatorsService2, dataShareService2, missionService2);
  
      console.log("constructor() userroletemplate.component");
      this.viewingUser = this.dataShareService2.getViewingUser();
      
  }

  ngOnInit() {
    console.log("ngOnInit() userroletemplate.component");
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

        this.userService2.getRoles(this.profileUserId, this.viewingUser["isCongress"])
        .subscribe((data) => {
          //console.log("roles count ", data.length);
          //this.role = JSON.parse(JSON.stringify(data[0]));
          //this.role['term'] = 'term';
          this.roles= data;
          //this.changeDetector.detectChanges();
          this.createFormGroup();
 
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

  createFormGroup() {
    //this.biodataTemplateForm = this.fbuilder.group({});
    //let struct:string = "\"{";//"new FormGroup({";
    this.roleTemplateForm = this.fbuilder.group({});

    this.displayProperties.forEach((element, index) => {
      let value = this.legislator[element['propId']];
      console.log('element[propId] ', element['propId'], ' this.legislator[element[propId]] ', this.legislator[element['propId']]);
      this.roleTemplateForm.setControl(element['propId'], new FormControl(value));
      //this.biodataTemplateForm.setControl(element['propId'], null);
    });
    this.changeDetector.detectChanges();
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
