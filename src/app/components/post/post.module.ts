import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MentionModule } from 'angular-mentions';


import { PostComponent } from './post.component';
import { PostcardComponent } from './postcard/postcard.component';
import { NewpostComponent } from './newpost/newpost.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {GpxUIComponentsModule} from '../gpx-uicomponents/gpx-uicomponents.module';
import {BannerComponent} from '../banner/banner.component';
import {dateFormatPipe} from '../../util/pipes/dateformat.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    GpxUIComponentsModule,
    MentionModule,
    ScrollingModule
  ],
  declarations: [
    //BannerComponent, 
    PostComponent, PostcardComponent, NewpostComponent, dateFormatPipe
  ],
  exports:[PostComponent] 
}) 
export class PostModule { }
