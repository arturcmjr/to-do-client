import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TimeStampPipe } from './pipes/date-format/date-format.pipe';
import { MoreDialogComponent } from './components/more-dialog/more-dialog.component';
import { SpinnerButtonDirective } from './directives/spinner-button.directive';
import { ThemeSheetComponent } from './components/theme-sheet/theme-sheet.component';



@NgModule({
  declarations: [
    LayoutComponent,
    TimeStampPipe,
    MoreDialogComponent,
    SpinnerButtonDirective,
    ThemeSheetComponent,
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
    TimeStampPipe,
    MoreDialogComponent,
    SpinnerButtonDirective,
  ],
})
export class SharedModule { }
