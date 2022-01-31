import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITask } from '@shared/services/tasks/tasks.interface';

@Component({
  selector: 'app-to-do-dialog',
  templateUrl: './to-do-dialog.component.html',
  styleUrls: ['./to-do-dialog.component.scss'],
})
export class ToDoDialogComponent {
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
  }

  public onSaveClick(): void {
    console.log(this.taskForm);
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const { text, date } = this.taskForm.value;
    this.dialogRef.close({ text, date, id: this.data?.id });
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onDeleteClick() : void {
    this.dialogRef.close({delete: this.data.id});
  }

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.taskForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }
}
