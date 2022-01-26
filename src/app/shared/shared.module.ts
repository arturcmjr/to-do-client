import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RelativeTimeStampPipe } from './pipes/relative-time-stamp/relative-time-stamp.pipe';
import { TimeStampPipe } from './pipes/time-stamp/time-stamp.pipe';



@NgModule({
  declarations: [
    LayoutComponent,
    RelativeTimeStampPipe,
    TimeStampPipe,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    BrowserModule,
  ],
  exports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule,
    RelativeTimeStampPipe,
    TimeStampPipe,
  ],
})
export class SharedModule { }
