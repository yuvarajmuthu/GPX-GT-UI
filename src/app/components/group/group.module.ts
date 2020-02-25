import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GroupComponent } from './group/group.component';
import { GrouptemplateComponent } from './grouptemplate/grouptemplate.component';
import {GroupRoutingModule} from '../group/group-routing.module';
import { GroupbusinesstemplateComponent } from './grouptemplate/groupbusinesstemplate/groupbusinesstemplate.component';
import { GrouppopulationtemplateComponent } from './grouptemplate/grouppopulationtemplate/grouppopulationtemplate.component';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    GroupRoutingModule
  ],
  declarations: [GroupComponent, GroupbusinesstemplateComponent, GrouppopulationtemplateComponent],
  entryComponents:[GroupbusinesstemplateComponent, GrouppopulationtemplateComponent]
})
export class GroupModule { }
