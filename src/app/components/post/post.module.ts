import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { MentionModule } from 'angular-mentions';
//import {GpxUIComponentsModule} from '../gpx-uicomponents/gpx-uicomponents.module';


import { PostComponent } from './post.component';
import { PostcardComponent } from './postcard/postcard.component';
import { NewpostComponent } from './newpost/newpost.component';
//import {BannerComponent} from '../banner/banner.component';
import {dateFormatPipe} from '../../util/pipes/dateformat.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TagInputModule } from 'ngx-chips';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxEmojiPickerModule,
    TagInputModule,
    //GpxUIComponentsModule,
    MentionModule,
    ScrollingModule,
    RouterModule
  ],
  declarations: [
    //BannerComponent, 
    PostComponent, PostcardComponent, NewpostComponent, dateFormatPipe
  ],
  exports:[PostComponent] 
}) 
export class PostModule { }
