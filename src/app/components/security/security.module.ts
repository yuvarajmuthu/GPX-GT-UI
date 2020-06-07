import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule }    from '@angular/forms';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreatepageComponent } from './createpage/createpage.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule //formGroup
  ],
  declarations: [RegisterComponent, LoginComponent, CreatepageComponent]
})
export class SecurityModule { }
