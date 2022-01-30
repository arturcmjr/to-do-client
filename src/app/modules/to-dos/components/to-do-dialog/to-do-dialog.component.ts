import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITask } from '@shared/services/tasks/tasks.interface';

@Component({
  selector: 'app-to-do-dialog',
  templateUrl: './to-do-dialog.component.html',
  styleUrls: ['./to-do-dialog.component.scss'],
})
export class ToDoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ToDoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITask
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
