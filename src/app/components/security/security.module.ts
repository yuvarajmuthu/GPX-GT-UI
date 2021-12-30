import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';


import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreatepageComponent } from './createpage/createpage.component';
import { GpsGlobalSearchComponent } from '../gps-global-search/gps-global-search.component';
import {GAddressSearchComponent} from '../../components/g-address-search/g-address-search.component';

import { CKEditorModule } from 'ckeditor4-angular';
//import {UserModule} from '../../components/user/user.module';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@NgModule({
  imports: [
    MatChipsModule,
    CommonModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    FormsModule,
    CKEditorModule
  ],
  exports:[GpsGlobalSearchComponent, GAddressSearchComponent],
  declarations: [RegisterComponent, LoginComponent, CreatepageComponent, GpsGlobalSearchComponent, GAddressSearchComponent],
  providers:[
    {provide:MAT_DIALOG_DATA, useValue:{}},
    {provide:MatDialogRef, useValue:{}}
  ]
})
export class SecurityModule {}
