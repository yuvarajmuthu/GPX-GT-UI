import { Component, OnInit } from '@angular/core';

import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-usercommitteetemplate',
  templateUrl: './usercommitteetemplate.component.html',
  styleUrls: ['./usercommitteetemplate.component.css']
})
export class UsercommitteetemplateComponent  extends AbstractTemplateComponent  implements OnInit{
  //userId = "u001";
  //legisId:string = "";
  
  id = "upCongressLegislatorCommitteeExternal";
  firstName:string = "";//"Pennsylvania's 14th congressional district";
  lastName:string = "";//"Pennsylvania's 14th congressional district includes the entire city of Pittsburgh and parts of surrounding suburbs. A variety of working class and majority black suburbs located to the east of the city are included, such as McKeesport and Wilkinsburg. Also a major part of the district are number of middle class suburbs that have historic Democratic roots, such as Pleasant Hills and Penn Hills. The seat has been held by Democrat Mike Doyle since 1995. In the 2006 election, he faced Green Party candidate Titus North and returned to the house with 90% of the vote.";
  userName:string = "";
  emailId = "";
  imageUrl:string = "";
  
  data = {};
  private userData = {};
  public profilesData = [];
  public profilesTemplates = [];
  private templateProperties = [];
  private templateData = [];
  
  
  //called after the constructor
  ngOnInit(): void {
    console.log("ngOnInit() userProfile.template TemplateLegisCongressCommitteeComponent");   
  }
  
  //called before ngOnInit()
  constructor(private userService2:UserService, 
    private dataShareService2:DatashareService, private missionService2: ComponentcommunicationService) {
  
      super(dataShareService2, missionService2);
  
      console.log("constructor() userProfile.template");      
  
      missionService2.missionAnnounced$.subscribe(
      mission => {
        console.log("Received save Profile message from parent for district " + mission);
  
        this.saveProfile(); 
      });
  
      //this.loadTemplateData();  
  
  
  
    }
  
    loadTemplateData(){
  //    this.userService2.getUserData(this.profileUserId, true).subscribe(
    //    data => {});
  
    }
  
    allowed():boolean{
        let permission:boolean = this.dataShareService2.checkPermissions();
        //console.log("allowed() - " + permission);
  
        return permission;
    }
  
    getData():string{
      let data = {};
  
  
      let dataString:string = JSON.stringify(data);
      console.log("TemplateIntroductionComponent data " + dataString);
      return dataString;
    }
  
    saveProfile(){
      this.data["profileTemplateId"] = this.id;
  
      console.log("Data " + JSON.stringify(this.data));
  
    }
  
  
  }
  