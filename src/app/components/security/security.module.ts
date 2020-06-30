import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule }    from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreatepageComponent } from './createpage/createpage.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, //formGroup
    AutocompleteLibModule,
    FormsModule,
    CKEditorModule
  ],
  declarations: [RegisterComponent, LoginComponent, CreatepageComponent]
})
export class SecurityModule { }
