import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ckeditor4-angular';
import { PostModule } from '../post/post.module';

import { GroupComponent } from './group/group.component';
import { GrouptemplateComponent } from './grouptemplate/grouptemplate.component';
import {GroupRoutingModule} from '../group/group-routing.module';
import { GroupbusinesstemplateComponent } from './grouptemplate/groupbusinesstemplate/groupbusinesstemplate.component';
import { GrouppopulationtemplateComponent } from './grouptemplate/grouppopulationtemplate/grouppopulationtemplate.component';
import { GroupbiodatatemplateComponent } from './grouptemplate/groupbiodatatemplate/groupbiodatatemplate.component';



@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgbModule,
    GroupRoutingModule,
    PostModule

  ],
  declarations: [GroupComponent, GroupbusinesstemplateComponent, GrouppopulationtemplateComponent, GroupbiodatatemplateComponent],
  entryComponents:[GroupbusinesstemplateComponent, GrouppopulationtemplateComponent]
})
export class GroupModule { }
