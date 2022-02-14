import { IterableDiffers } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToDoDialogComponent } from '@modules/to-dos/components/to-do-dialog/to-do-dialog.component';
import { AuthService } from '@shared/services/auth/auth.service';
import { FirebaseService } from '@shared/services/firebase/firebase.service';
import { ITask } from '@shared/services/tasks/tasks.interface';
import { TasksService } from '@shared/services/tasks/tasks.service';
import { Observable, of } from 'rxjs';

import { ToDosComponent } from './to-dos.component';

class MockTasksService extends TasksService {

  protected override getTasks(done: boolean): Observable<ITask[]> {
    return new Observable<ITask[]>((observable) => {
      observable.next([
        {text: 'bom dia', id: 'test', order: 0},
      ]);
      observable.complete();
    });
  }
}

describe('ToDosComponent', () => {
  let component: ToDosComponent;
  let fixture: ComponentFixture<ToDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatDialogModule, RouterTestingModule, MatSnackBarModule],
      declarations: [ToDosComponent],
      providers: [{ provide: TasksService, useClass: MockTasksService },]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    component.openDialog();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName(
      'mat-dialog-container'
    )[0] as HTMLHeadElement;
    expect(popUpHeader).toBeTruthy();
  });

  it('should have to do tasks', () => {
    fixture.detectChanges();
    expect(component.todo.length).toBeGreaterThan(0);
  });

  it('should show to do tasks', () => {
    const taskText = 'sample task to be done';
    component.todo = [{ text: taskText, id: '0', order: 0 }];
    fixture.detectChanges();
    const todo = document.getElementById('todoList') as HTMLHeadElement;
    expect(todo.innerHTML).toContain(taskText);
  });

  it('should show done tasks', () => {
    const taskText = "sample task that it's done";
    component.todo = [{ text: taskText, id: '0', order: 0 }];
    component.showDone = true;
    fixture.detectChanges();
    const done = fixture.nativeElement as HTMLElement;
    expect(done.innerHTML).toContain(taskText);
  });

  it('should show to do count on title', () => {
    component.todo = [
      { text: 'null', id: '0', order: 0 },
      { text: 'null', id: '1', order: 1 },
    ];
    fixture.detectChanges();
    expect(document.title).toBe('To Do (2)');
  });
});
