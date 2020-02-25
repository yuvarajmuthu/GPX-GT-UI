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
import {GroupbusinesstemplateComponent} from './groupbusinesstemplate/groupbusinesstemplate.component';
import {GrouppopulationtemplateComponent} from './grouppopulationtemplate/grouppopulationtemplate.component';

@NgModule({
  declarations: [
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

  comp:any;

/*    @ViewChild(TemplatePopulationComponent)
  populationComponent: TemplatePopulationComponent;

  callChild(){
    console.log("calling child ");
    console.log("printing female count " + this.populationComponent.femaleCount);
    this.populationComponent.getData();  
  }
*/
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

/*
selected_permission = 'Editor';
checkPermissions() {
    if(this.selected_permission == 'Editor') {
      return true;
    } 
    else {
      return false;
    }
  } 
  */

  private mappings = {
      //'districtIntroTemplate': TemplateIntroductionComponent,
      'districtBusinessTemplate': GroupbusinesstemplateComponent,
      'districtPopulationTemplate': GrouppopulationtemplateComponent
  };

  private componentRef: ComponentRef<{}>;

  constructor(private missionService:ComponentcommunicationService, 
                private viewContainerRef: ViewContainerRef, 
                private componentFactoryResolver:ComponentFactoryResolver,
                private dataShareService:DatashareService
                ) {
      //super();
      missionService.missionProfileTemplateRemoved$.subscribe(
      mission => {
        console.log("mission confirmed " + mission);
        console.log("this.viewContainerRef.length " + this.viewContainerRef.length);
        console.log("this.viewContainerRef.indexOf(mission) " + this.viewContainerRef.indexOf(mission));
        let index:number = this.viewContainerRef.indexOf(mission);
        this.viewContainerRef.remove(index);
        //this.viewContainerRef.remove(0);
      });
  }

  getComponentType(typeName: string) {
      let type = this.mappings[typeName];
      return type;
  }

  ngOnChanges(){
      console.log('constitution.template.component ngOnChanges() ');
      this.loadComponentTemplate();
  }
/*
isPop(object: any): object is TemplatePopulationComponent {
    return true;
}
*/

loadComponentTemplate() {
  // console.log('loadComponentTemplate() ' + this.type);
  // let cRef:Promise<ComponentRef<any>>;
  // if (this.type) {
  //   for(let compType of this.type){
  //     let component = this.mappings[compType];
  //     this.comp = component;
  //     cRef = this.loader.loadNextToLocation(component, this.viewContainerRef);
  //     cRef.then((cRef) => {
  //       let vRef:ViewRef = cRef.hostView;
  //       console.log("vRef " + vRef);
  //       this.dataShareService.setDistrictViews(this.comp, vRef);
  //     });

  //   }
    
  // }
  console.log('in load template ' + this.type);
  if (this.type) {
    for(let compType of this.type){
      let component = this.mappings[compType];
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);    

      let viewContainerRef = this.container.createComponent(componentFactory);

    }
    
  }

}

}
