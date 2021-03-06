import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreatepageComponent } from './createpage/createpage.component';
import { GpsGlobalSearchComponent } from '../gps-global-search/gps-global-search.component';

import { CKEditorModule } from 'ckeditor4-angular';
//import {UserModule} from '../../components/user/user.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    FormsModule,
    CKEditorModule
  ],
  exports:[GpsGlobalSearchComponent],
  declarations: [RegisterComponent, LoginComponent, CreatepageComponent, GpsGlobalSearchComponent]
})
export class SecurityModule {}
