import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpxInputComponent } from './gpx-input/gpx-input.component';
import { GpxFileuploadComponent } from './gpx-fileupload/gpx-fileupload.component';
import { AlertComponent } from './alert/alert.component';
import { TopnavbarComponent } from './gpx-nav/topnavbar/topnavbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GpxInputComponent, GpxFileuploadComponent, AlertComponent, TopnavbarComponent],
  exports: [GpxInputComponent, GpxFileuploadComponent, AlertComponent, TopnavbarComponent]

}) 
export class GpxUIComponentsModule { }
