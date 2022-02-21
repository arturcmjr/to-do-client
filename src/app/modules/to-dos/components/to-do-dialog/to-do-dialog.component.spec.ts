import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { generateUid } from '@shared/helpers/mock/generate-uid';

import { ToDoDialogComponent } from './to-do-dialog.component';

describe('ToDoDialogComponent', () => {
  let component: ToDoDialogComponent;
  let fixture: ComponentFixture<ToDoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ToDoDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: (data: any) => {} } },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have task on title', () => {
    expect(document.querySelector('h2')?.innerHTML).toContain('Task');
  });

  it('form should be invalid when empty', () => {
    expect(component.taskForm.valid).toBeFalsy();
  });

  it('should close dialog with no data on cancel', () => {
    const closeMock = spyOn(component.dialogRef, 'close');
    const actions = document.getElementsByClassName(
      'w-100 d-flex justify-content-end'
    )[0];
    const cancelButton = actions.firstChild as HTMLElement;
    cancelButton.click();
    expect(closeMock).toHaveBeenCalledWith();
  });

  it('should call close dialog for delete', () => {
    const closeMock = spyOn(component.dialogRef, 'close');
    const taskId = generateUid();
    component.data = { id: taskId, order: 0, text: 'some_text' };
    fixture.detectChanges();
    const title = document.getElementsByClassName('mat-dialog-title')[0];
    const deleteButton = title.children[1] as HTMLElement;
    deleteButton.click();
    expect(closeMock).toHaveBeenCalledWith({
      taskId: taskId,
      category: 'delete',
    });
  });

  it('should call close dialog for create', () => {
    const closeMock = spyOn(component.dialogRef, 'close');
    component.taskForm.get('text')?.setValue('some_text');
    const title = document.getElementsByClassName('mat-dialog-actions')[0];
    const button = title.children[1] as HTMLElement;
    button.click();
    expect(closeMock).toHaveBeenCalledWith({
      taskId: undefined,
      category: 'create',
      text: 'some_text',
      date: undefined,
    });
  });

  it('should call close dialog for update', () => {
    const closeMock = spyOn(component.dialogRef, 'close');
    const taskId = generateUid();
    component.data = { id: taskId, order: 0, text: 'some_text' };
    fixture.detectChanges();
    component.taskForm.get('text')?.setValue('updated_text');
    const title = document.getElementsByClassName('mat-dialog-actions')[0];
    const button = title.children[1] as HTMLElement;
    button.click();
    expect(closeMock).toHaveBeenCalledWith({
      taskId: taskId,
      category: 'update',
      text: 'updated_text',
      date: undefined,
    });
  });

  it('should show invalid date error', () => {
    const date = component.taskForm.get('date');
    date?.setErrors({ matDatepickerParse: true });
    date?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('Date is not valid');
  });
});
