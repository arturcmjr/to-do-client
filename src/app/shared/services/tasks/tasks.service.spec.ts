import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { generateUid } from '@shared/helpers/mock/generate-uid';
import { Observable } from 'rxjs';
import { ITask } from './tasks.interface';

import { TasksService } from './tasks.service';

export class MockTasksService extends TasksService {
  protected override getTasks(done: boolean): Observable<ITask[]> {
    return new Observable<ITask[]>((observable) => {
      let tasks: ITask[] = [];
      const length = done ? 2 : 7;
      for (let i = 0; i < length; i++) {
        tasks.push({ text: `task ${i}`, id: generateUid(), order: i });
      }
      observable.next(tasks);
      observable.complete();
    });
  }

  public override createTodo(text: string, date?: Date): Observable<ITask> {
    return new Observable<ITask>((observable) => {
      observable.next({
        text,
        date,
        id: generateUid(),
        order: 0,
      });
      observable.complete();
    });
  }

  public override updateTask(
    done: boolean,
    taskId: string,
    text: string,
    date?: Date
  ): Observable<void> {
    return new Observable<void>((observable) => {
      observable.next();
      observable.complete();
    });
  }

  public override deleteTask(taskId: string, done: boolean): Observable<void> {
    return new Observable<void>((observable) => {
      observable.next();
      observable.complete();
    });
  }
}

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule]
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
