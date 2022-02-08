import { NgModule } from '@angular/core';
import { ToDosComponent } from './to-dos/pages/to-dos/to-dos.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/pages/login/login.component';
import { RegisterComponent } from './login/pages/register/register.component';
import { ToDoDialogComponent } from './to-dos/components/to-do-dialog/to-do-dialog.component';
import { RecoverPasswordComponent } from './login/pages/recover-password/recover-password.component';
import { ConfirmPasswordRecoveryComponent } from './login/pages/confirm-password-recovery/confirm-password-recovery.component';



@NgModule({
  declarations: [
    ToDosComponent,
    LoginComponent,
    RegisterComponent,
    ToDoDialogComponent,
    RecoverPasswordComponent,
    ConfirmPasswordRecoveryComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class ModulesModule { }
