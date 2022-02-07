import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@modules/login/pages/login/login.component';
import { RecoverPasswordComponent } from '@modules/login/pages/recover-password/recover-password.component';
import { RegisterComponent } from '@modules/login/pages/register/register.component';
import { ToDosComponent } from '@modules/to-dos/pages/to-dos/to-dos.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { LoginGuard } from '@shared/guards/login/login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'recover-password', component: RecoverPasswordComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'tasks', component: ToDosComponent, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
