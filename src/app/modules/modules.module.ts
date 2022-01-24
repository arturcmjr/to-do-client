import { NgModule } from '@angular/core';
import { ToDosComponent } from './to-dos/pages/to-dos/to-dos.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/pages/login/login.component';
import { RegisterComponent } from './login/pages/register/register.component';



@NgModule({
  declarations: [
    ToDosComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class ModulesModule { }
