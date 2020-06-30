import {DatashareService} from '../../services/datashare.service';
import {ComponentcommunicationService}     from '../../services/componentcommunication.service';
//import {UserService} from '../../services/user.service';
import { LegislatorService } from '../../services/legislator.service';

import { Legislator } from '../../models/legislator';


export abstract class AbstractTemplateComponent {
    context: any;
    
    legisId:string = "";
    public profileUserId:string;
    public legislator: Legislator;
    public firstName:string;
    public lastName:string;
    public bioguideImageUrl:string;
    resultop:any;
    public keys = [];
    public displayProperties = [];
    public committeeKeys = [];
    public committees = [];
    public committeesLength:number = 0;
    public viewingUser={};
    
    constructor(private dataShareService:DatashareService, 
      private missionService: ComponentcommunicationService) {
      this.viewingUser = this.dataShareService.getViewingUser();
      this.profileUserId = this.viewingUser['userId'];
     /* 
      if(this.viewingUser['isLegislator']){
        this.loadLegislator();
      }
      */ 
    }

    getLegislator():Legislator{
      //this.loadLegislator();
      return this.legislator;
    }
    
    getKeys():Array<string>{
      return this.keys;
    }
    
    //abstract getData():string;
    
      setValue(jsonData) {
          console.log(' saved! the obj  - ' + JSON.stringify(jsonData));
          for(var key in jsonData){
            if(jsonData.hasOwnProperty(key)){
              this[key] = jsonData[key];
              console.log('New value  - ' + key + " - " + this[key]);
            }
          }
      }
    
      loadLegislator(): void { 
        console.log("loadLegislator() userProfile.template AbstractTemplateComponent");   
    
    
                      this.legislator = this.viewingUser['externalData'];
                      this.firstName = this.legislator.first_name;
                      this.lastName = this.legislator.last_name;
                    console.log("Loading: " + JSON.stringify(this.legislator));
                 this.keys = Object.keys(this.legislator);
                 console.log("keys " + this.keys);    
    
                 this.bioguideImageUrl = this.legislator.photo_url;
    
           
      /*   
      if(this.viewingUser['userId']){  
        this.legisId = this.viewingUser['userId'];
          console.log("this.legisId " + this.legisId);
    
            this.legislatorsService.getLegislature(this.legisId, 'bioguide_id')
      .subscribe((result) => {
                  this.legislator = result;
                  this.firstName = this.legislator.first_name;
                  this.lastName = this.legislator.last_name;
                console.log("Loading: " + this.legislator);
             this.keys = Object.keys(this.legislator);
             console.log("keys " + this.keys);    
    
             this.bioguideImageUrl = this.legislator.photo_url;
              });
    
            //getting the COMMITTEES
            /*
            this.legislatorsService.getCommittees(this.legisId)
      .map(result => this.resultop = result.results)
      .subscribe((result) => {
                console.log("Committees length " + result.length);
                if(result.length > 0){
                  //this.legislator.committees = result;
                  //this.legislator["committeeKeys"] = Object.keys(result[0]);
                  this.committeeKeys = Object.keys(result[0]);
                  this.committees = result;
                  this.committeesLength = result.length;
    
                  console.log("this.committeeKeys " + this.committeeKeys);
                  console.log("this.committees " + this.committees);
    
    
                }
              });
      COMMENT HERE FOR COMMITTEES
    
      }
      */
    }
     
}
    