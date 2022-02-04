import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToDoDialogComponent } from './to-do-dialog.component';

describe('ToDoDialogComponent', () => {
  let component: ToDoDialogComponent;
  let fixture: ComponentFixture<ToDoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToDoDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
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

  // it('should not call modalService.open on uploadFile when filePath is empty', () => {
    
  // });
});
