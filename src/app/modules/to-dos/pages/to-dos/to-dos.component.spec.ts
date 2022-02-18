import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env';
import {
  ITasksDialogResult,
} from '@modules/to-dos/components/to-do-dialog/to-do-dialog.component';
import { generateUid } from '@shared/helpers/mock/generate-uid';
import { ITask } from '@shared/services/tasks/tasks.interface';
import { TasksService } from '@shared/services/tasks/tasks.service';
import { MockTasksService } from '@shared/services/tasks/tasks.service.spec';

import { ToDosComponent } from './to-dos.component';


describe('ToDosComponent', () => {
  let component: ToDosComponent;
  let fixture: ComponentFixture<ToDosComponent>;

  beforeEach(async () => {
    ToDosComponent.prototype.ngOnInit = () => {};
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatCheckboxModule,
      ],
      declarations: [ToDosComponent],
      providers: [{ provide: TasksService, useClass: MockTasksService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.todo = [];
    component.done = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    component.openDialog();
    const popUpHeader = document.getElementsByTagName(
      'mat-dialog-container'
    )[0] as HTMLHeadElement;
    expect(popUpHeader).toBeTruthy();
  });

  it('should have to do tasks on data fetched', () => {
    component['fetchData']();
    fixture.detectChanges();
    expect(component.todo.length && component.done.length).toBeGreaterThan(0);
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

  it('should call updateTitle on todo change', () => {
    spyOn<any>(component, 'updateTitle');
    component.todo = [{ text: 'null', id: '0', order: 0 }];
    fixture.detectChanges();
    expect(component['updateTitle']).toHaveBeenCalled();
  });

  it('should show app name when there is no tasks to do', () => {
    component.todo = [];
    component['updateTitle']();
    fixture.detectChanges();
    expect(document.title).toBe(environment.appName);
  });

  it('should call openDialog for new task on button click', () => {
    spyOn(component, 'openDialog');
    const button = document.getElementsByTagName('button')[0];
    button.click();
    fixture.detectChanges();
    expect(component.openDialog).toHaveBeenCalledWith();
  });

  it('should call openDialog for edit task on task click', fakeAsync(() => {
    const clickMock = spyOn(component, 'openDialog');
    const task: ITask = {
      text: 'null',
      id: '0',
      order: 0,
    };
    component.todo = [task];
    fixture.detectChanges();
    tick();
    const todoContainer = document.getElementById('todoList');
    const wrapper = todoContainer?.getElementsByClassName('task-wrapper')[0];
    const taskEl = wrapper?.children[1] as HTMLElement;
    taskEl.click();
    expect(clickMock).toHaveBeenCalledWith(task);
  }));

  it('should call onTaskCreate on dialog close after creating task', () => {
    const functionMock = spyOn<any>(component, 'onTaskCreate');
    const data: ITasksDialogResult = {
      category: 'create',
      taskId: '0',
      text: '-',
    };
    component['onDialogClose'](data);
    expect(functionMock).toHaveBeenCalledWith(data);
  });

  it('should call onTaskUpdate on dialog close after updating task', () => {
    const functionMock = spyOn<any>(component, 'onTaskUpdate');
    const data: ITasksDialogResult = {
      category: 'update',
      taskId: '0',
      text: '-',
    };
    component['onDialogClose'](data);
    expect(functionMock).toHaveBeenCalledWith(data);
  });

  it('should call onTaskDelete on dialog close after updating task', () => {
    const functionMock = spyOn<any>(component, 'onTaskDelete');
    const data: ITasksDialogResult = {
      category: 'delete',
      taskId: '0',
    };
    component['onDialogClose'](data);
    expect(functionMock).toHaveBeenCalledWith(data);
  });

  it('should create task', () => {
    spyOn<any>(component, 'saveOrder');
    const data: ITasksDialogResult = {
      category: 'create',
      taskId: 'x',
      text: 'new task text',
    };
    component['onTaskCreate'](data);
    const task = component.todo[0];
    expect(data.text).toBe(task.text);
  });

  it('should update task', () => {
    spyOn<any>(component, 'saveOrder');
    const taskId = generateUid();
    const originalTask: ITask = {
      id: taskId,
      order: 0,
      text: 'old text',
    };
    component.todo = [originalTask];
    const data: ITasksDialogResult = {
      category: 'update',
      taskId: taskId,
      text: 'new text',
    };
    component['onTaskUpdate'](data);
    const task = component.todo[0];
    expect(data.text).toBe(task.text);
  });

  it('should delete task', () => {
    spyOn<any>(component, 'saveOrder');
    const taskId = generateUid();
    const originalTask: ITask = {
      id: taskId,
      order: 0,
      text: 'task text',
    };
    component.todo = [originalTask];
    const data: ITasksDialogResult = {
      category: 'delete',
      taskId: taskId,
    };
    component['onTaskDelete'](data);
    const found = component.todo.find((t) => t.id === taskId);
    expect(found).toBeFalsy();
  });

  it('should know if task is done', () => {
    const taskId = generateUid();
    const task: ITask = {
      id: taskId,
      order: 0,
      text: 'task text',
    };
    component.done = [task];
    const taskIsDone = component['taskIsDone'](taskId);
    expect(taskIsDone).toBeTrue();
  });

  it('should call markTaskAs on task checkbox click', fakeAsync(() => {
    const clickMock = spyOn(component, 'markTaskAs');
    const task: ITask = {
      text: 'null',
      id: generateUid(),
      order: 0,
    };
    component.todo = [task];
    fixture.detectChanges();
    tick();
    const todoContainer = document.getElementById('todoList');
    const wrapper = todoContainer?.getElementsByClassName('task-wrapper')[0];
    const checkBoxLabelEl = wrapper?.firstChild?.firstChild as HTMLInputElement;
    checkBoxLabelEl.click();
    expect(clickMock).toHaveBeenCalledWith(task, true);
  }));
});
