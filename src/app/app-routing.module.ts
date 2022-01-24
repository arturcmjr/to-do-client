import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@modules/login/pages/login/login.component';
import { RegisterComponent } from '@modules/login/pages/register/register.component';
import { ToDosComponent } from '@modules/to-dos/pages/to-dos/to-dos.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: 'todo', component: ToDosComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
