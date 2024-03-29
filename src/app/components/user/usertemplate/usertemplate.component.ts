import { 
  Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, 
  ViewChild, ViewContainerRef, 
  ComponentRef, Type, ComponentFactoryResolver
} from '@angular/core';

import { Router } from "@angular/router";
import { NgModule } from '@angular/core';

import {GpxUIComponentsModule} from '../../gpx-uicomponents/gpx-uicomponents.module';
//import {GpxInputComponent} from '../../gpx-uicomponents/gpx-input/gpx-input.component';

import {DatashareService} from '../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../services/componentcommunication.service';
import {UserService} from '../../../services/user.service';
import { LegislatorService } from '../../../services/legislator.service';

import { Legislator } from '../../../models/legislator';

//import {TemplateLegisUserDefaultComponent, TemplateLegisCongressProfileComponent, TemplateLegisCongressCommitteeComponent} from '.';
import {UserbannertemplateComponent} from './userbannertemplate/userbannertemplate.component';
import {UserbiodatatemplateComponent} from './userbiodatatemplate/userbiodatatemplate.component';
import {UsercommitteetemplateComponent} from './usercommitteetemplate/usercommitteetemplate.component';
import { UserroletemplateComponent } from './userroletemplate/userroletemplate.component';
import { UserofficetemplateComponent } from './userofficetemplate/userofficetemplate.component';
import { UsereventtemplateComponent } from './usereventtemplate/usereventtemplate.component';
import { UserbilltemplateComponent } from './userbilltemplate/userbilltemplate.component';
import { UservotetemplateComponent } from './uservotetemplate/uservotetemplate.component';
import { UsermembertemplateComponent } from './usermembertemplate/usermembertemplate.component';

import {AbstractTemplateComponent} from '../abstractTemplateComponent';

@NgModule({
  declarations: [
    // TemplateLegisUserDefaultComponent, 
    // TemplateLegisCongressProfileComponent, 
    // TemplateLegisCongressCommitteeComponent
    //GpxInputComponent,
    UserbannertemplateComponent,
    UserbiodatatemplateComponent,
    UsercommitteetemplateComponent,
    UserroletemplateComponent,
    UserofficetemplateComponent,
    UsereventtemplateComponent,
    UserbilltemplateComponent,
    UservotetemplateComponent,
    UsermembertemplateComponent
  ],
  imports: [
    GpxUIComponentsModule,

  ]
})

@Component({
  selector: 'app-usertemplate',
  templateUrl: './usertemplate.component.html',
  styleUrls: ['./usertemplate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsertemplateComponent implements OnChanges {

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input()
  type= [];

  @Input()
  context: any;

  @Input()
  data:string;
  //all the user profile templates should be mapped here
  private mappings = {
    'upDefault' : UserbannertemplateComponent,
    'upDefault1' : UserbannertemplateComponent,//FOR TESTING
    'upDefault2' : UserbannertemplateComponent,//FOR TESTING
    'upCongressLegislatorExternal' : UserbiodatatemplateComponent,
    'upCongressLegislatorCommitteeExternal' : UsercommitteetemplateComponent,
    'upRole' : UserroletemplateComponent,
    'upOffices' : UserofficetemplateComponent,
    'upEvent' : UsereventtemplateComponent,
    'upBill' : UserbilltemplateComponent,
    'upVote' : UservotetemplateComponent,
    'upOtherContacts' : UservotetemplateComponent,
    'upMember' : UsermembertemplateComponent 
};

private componentRef: ComponentRef<{}>;

constructor(
    private viewContainerRef: ViewContainerRef, 
    private componentFactoryResolver:ComponentFactoryResolver,
    private dataShareService:DatashareService) {
  //super();
}

//invoked whenever component type changes, adds the new component next to the existing components
ngOnChanges(type: SimpleChanges){
  console.log('usertemplate.component ngOnChanges() ');
  this.loadComponentTemplate();
}

getPermission():string{
    let data = this.dataShareService.getPermission();
    return data;
}

setPermission(data:string){
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

    }
    
  }

}


}






