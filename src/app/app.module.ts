import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { AuthGuard } from '@shared/guards/auth/auth.guard';
import { LoginGuard } from '@shared/guards/login/login.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, SharedModule, ModulesModule],
  providers: [AuthGuard, LoginGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
