import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import { UserComponent } from './user/user.component';
import { UsertemplateComponent } from './usertemplate/usertemplate.component';

import {UserRoutingModule} from './user-routing.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//import { BannerComponent } from '../banner/banner.component';

import { UserbannertemplateComponent } from './usertemplate/userbannertemplate/userbannertemplate.component';
import { UsercommitteetemplateComponent } from './usertemplate/usercommitteetemplate/usercommitteetemplate.component';
import { UserbiodatatemplateComponent } from './usertemplate/userbiodatatemplate/userbiodatatemplate.component';
import { UserroletemplateComponent } from './usertemplate/userroletemplate/userroletemplate.component';
import { UserofficetemplateComponent } from './usertemplate/userofficetemplate/userofficetemplate.component';
import { Usercard1Component } from './usercard1/usercard1.component';

import { PostModule } from '../post/post.module';
import {GpxUIComponentsModule} from '../../components/gpx-uicomponents/gpx-uicomponents.module';

import { UserstageComponent } from './userstage/userstage.component';
import { Usercard2Component } from './usercard2/usercard2.component';
import { UserroleComponent } from './usertemplate/userroletemplate/userrole/userrole.component';
import { UserofficeComponent } from './usertemplate/userofficetemplate/useroffice/useroffice.component';
import { UsereventtemplateComponent } from './usertemplate/usereventtemplate/usereventtemplate.component';
import { UservotetemplateComponent } from './usertemplate/uservotetemplate/uservotetemplate.component';
import { UserbilltemplateComponent } from './usertemplate/userbilltemplate/userbilltemplate.component';
import { UsereventformComponent } from './usertemplate/usereventtemplate/usereventform/usereventform.component';
//import {GAddressSearchComponent} from '../g-address-search/g-address-search.component';
import { UservoteformComponent } from './usertemplate/uservotetemplate/uservoteform/uservoteform.component';
import { UsermembertemplateComponent } from './usertemplate/usermembertemplate/usermembertemplate.component';

//import { GpsGlobalSearchComponent } from '../gps-global-search/gps-global-search.component';
import {SecurityModule} from '../../components/security/security.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    SecurityModule,
    ReactiveFormsModule,
    CKEditorModule,
    AutocompleteLibModule,
    UserRoutingModule,
    GpxUIComponentsModule,
    NgbModule,
    MatMenuModule,
    MatIconModule,
    PostModule
  ],
  exports: [
    Usercard2Component],
  //Any component as well as directives and pipes need to be added in declarations array  
  declarations: [
    UserComponent, 
    UsertemplateComponent, 
    Usercard1Component, 
    Usercard2Component,
    UserbannertemplateComponent, UsercommitteetemplateComponent, UserbiodatatemplateComponent, 
    UserroletemplateComponent, UserofficetemplateComponent, UserstageComponent, UserroleComponent, UserofficeComponent, UsereventtemplateComponent, UservotetemplateComponent, UserbilltemplateComponent, UsereventformComponent, UservoteformComponent, UsermembertemplateComponent
  ],
  //The entryComponents array is used to define only components that are not found in html and created dynamically with ComponentFactoryResolver.
  entryComponents:[UserstageComponent, UserroleComponent, UserofficeComponent, UserbannertemplateComponent, UsercommitteetemplateComponent, 
    UserbiodatatemplateComponent, UserroletemplateComponent, UserofficetemplateComponent, 
    UsereventtemplateComponent, UservotetemplateComponent, UserbilltemplateComponent,UsereventformComponent, UservoteformComponent, UsermembertemplateComponent],
  //exports:[UserstageComponent]
})
export class UserModule { }
