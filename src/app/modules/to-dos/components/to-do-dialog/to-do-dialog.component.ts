import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isMobileDevice } from '@shared/helpers/others/is-mobile-device';
import { ITask } from '@shared/services/tasks/tasks.interface';

export interface ITasksDialogResult {
  category: 'create' | 'update' | 'delete';
  taskId: string;
  text?: string;
  date?: Date;
}

@Component({
  selector: 'app-to-do-dialog',
  templateUrl: './to-do-dialog.component.html',
  styleUrls: ['./to-do-dialog.component.scss'],
})
export class ToDoDialogComponent {
  public title: string;
  public taskForm = new FormGroup({
    text: new FormControl(null, Validators.required),
    date: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<ToDoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITask
  ) {
    this.taskForm.get('text')?.setValue(data?.text);
    this.taskForm.get('date')?.setValue(data?.date);
    this.title = data?.id? 'Edit Task' : 'Create Task';
  }

  public onSaveClick(): void {
    console.log(this.taskForm);
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const { text, date } = this.taskForm.value;
    const data: ITasksDialogResult = {
      taskId: this.data.id,
      category: this.data?.id ? 'update' : 'create',
      text,
      date,
    };
    this.dialogRef.close(data);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onDeleteClick(): void {
    const data: ITasksDialogResult = {
      taskId: this.data.id,
      category: 'delete',
    };
    this.dialogRef.close(data);
  }

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.taskForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }

  public isMobile(): boolean {
    return isMobileDevice();
  }
}
