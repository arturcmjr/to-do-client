import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ToDosComponent } from './to-dos.component';

describe('ToDosComponent', () => {
  let component: ToDosComponent;
  let fixture: ComponentFixture<ToDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatDialogModule, RouterTestingModule],
      declarations: [ToDosComponent],
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
    fixture.componentInstance.openDialog();
    window.setTimeout(() => {
      fixture.detectChanges();
      const popUpHeader = document.getElementsByTagName(
        'h2'
      )[0] as HTMLHeadElement;
      expect(popUpHeader.innerText).toContain('Task');
    });
  });

  it('should have tasks to do', () => {
    const taskText = 'sample task to be done';
    fixture.componentInstance.todo = [
      { text: taskText, id: '0', order: 0 },
    ];
    fixture.detectChanges();
    const todo = document.getElementById('todoList') as HTMLHeadElement;
    expect(todo.innerHTML).toContain(taskText);
  });

  it('should have tasks done', () => {
    const taskText = 'sample task that it\'s done';
    fixture.componentInstance.todo = [
      { text: taskText, id: '0', order: 0 },
    ];
    fixture.componentInstance.showDone = true;
    window.setTimeout(() => {
      fixture.detectChanges();
      const done = document.getElementById('doneList') as HTMLHeadElement;
      expect(done.innerHTML).toContain(taskText);
    });
  });

  it('should show tasks to be done on title', () => {
    fixture.componentInstance.todo = [
      { text: 'null', id: '0', order: 0 },
      { text: 'null', id: '1', order: 1 },
    ];
    fixture.detectChanges();
    expect(document.title).toBe('To Do (2)');
  });
});
