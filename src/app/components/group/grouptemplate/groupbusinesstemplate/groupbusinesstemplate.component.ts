import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, EmbeddedViewRef, ViewRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
//import {ProfileService} from '../../../../services/profile.service';

import {AbstractTemplateGroupComponent} from '../../abstractTemplateGroupComponent';
@Component({
  selector: 'app-groupbusinesstemplate',
  templateUrl: './groupbusinesstemplate.component.html',
  styleUrls: ['./groupbusinesstemplate.component.css']
})
export class GroupbusinesstemplateComponent extends AbstractTemplateGroupComponent implements OnInit {


  ngOnInit() {
  }

  id:string = "districtBusinessTemplate";
        constructor(private dataShareService2:DatashareService, 
          private missionService: ComponentcommunicationService) {
          super(dataShareService2);

          missionService.missionAnnounced$.subscribe(
          mission => {
            console.log("Received save Profile message from parent for district " + mission);
            console.log("Data " + this.getData());
        });

          this.loadTemplateData(this.id);
    }


      getData():string{
        let data = {};
       
        let dataString:string = JSON.stringify(data);
        console.log("TemplateBusinessComponent data " + dataString);
        return dataString;
    }

}
