import { NgModule } from '@angular/core';
import { ToDosComponent } from './to-dos/pages/to-dos/to-dos.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ToDosComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class ModulesModule { }
