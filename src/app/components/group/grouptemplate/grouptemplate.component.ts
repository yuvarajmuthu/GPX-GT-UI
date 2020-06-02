import { 
  Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, 
  ViewChild, ViewContainerRef, 
  ComponentRef, Type, ComponentFactoryResolver
} from '@angular/core';

import { Router } from "@angular/router";
import { NgModule } from '@angular/core';
import {DatashareService} from '../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../services/componentcommunication.service';
import {UserService} from '../../../services/user.service';
import { LegislatorService } from '../../../services/legislator.service';

import { Legislator } from '../../../models/legislator';

import {AbstractTemplateGroupComponent} from '../abstractTemplateGroupComponent'; 
import {GroupbiodatatemplateComponent} from './groupbiodatatemplate/groupbiodatatemplate.component';
import {GroupbusinesstemplateComponent} from './groupbusinesstemplate/groupbusinesstemplate.component';
import {GrouppopulationtemplateComponent} from './grouppopulationtemplate/grouppopulationtemplate.component';

@NgModule({
  declarations: [
    GroupbiodatatemplateComponent,
    GroupbusinesstemplateComponent,
    GrouppopulationtemplateComponent
  ] 
})


@Component({
  selector: 'app-grouptemplate',
  templateUrl: './grouptemplate.component.html',
  styleUrls: ['./grouptemplate.component.css']
})
export class GrouptemplateComponent implements OnChanges {

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input()
  type= [];

  @Input()
  context: any;

  @Input()
  data:string;

  private mappings = {
      'districtBioTemplate': GroupbiodatatemplateComponent,
      'districtBusinessTemplate': GroupbusinesstemplateComponent,
      'districtPopulationTemplate': GrouppopulationtemplateComponent
  };

  
constructor(
  private viewContainerRef: ViewContainerRef, 
  private componentFactoryResolver:ComponentFactoryResolver,
  private dataShareService:DatashareService) {
//super();
}

//invoked whenever component type changes, adds the new component next to the existing components
ngOnChanges(type: SimpleChanges){
console.log('userProfile.template.component ngOnChanges() ');
this.loadComponentTemplate();
}

getPermission():string{
            //console.log("calling getter");
      let data = this.dataShareService.getPermission();
  //console.log("getPermission() " + data);
  return data;
}

setPermission(data:string){
  //console.log("calling setter");
  this.dataShareService.setPermission(data);    

}


allowed():boolean{
    let permission:boolean = this.dataShareService.checkPermissions();
    console.log("allowed() - " + permission);

    return permission;
}

getComponentType(typeName: string) {
    let type = this.mappings[typeName];
    return type;
}


loadComponentTemplate() {

console.log('in load template ' + this.type);
if (this.type) {
  for(let compType of this.type){
    let component = this.mappings[compType];
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);    
    this.container.clear();
    let viewContainerRef = this.container.createComponent(componentFactory);
    //viewContainerRef = this.container.createEmbeddedView();
    //this.loader.loadNextToLocation(component, this.viewContainerRef);
    /*
    this.loader.loadNextToLocation(component, this.viewContainerRef).then(componentRef=> {
      if(this.isPop(component)){
        componentRef.instance.show = true;}
      });
    */
  }
  
}

}

}
