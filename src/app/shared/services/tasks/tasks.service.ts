import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@shared/services/auth/auth.service';
import {
  child,
  Database,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { IDbTask, ITask } from './tasks.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private database: Database;

  constructor(
    private firebase: FirebaseService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.database = firebase.getDataBase();
  }

  public showError(): void {
    // showing generic error for a while
    this.snackBar.open('something went wrong', undefined, {
      panelClass: ['mat-toolbar', 'mat-warn'],
      duration: 2000,
    });
  }

  public createTodo(text: string, date?: Date): Observable<ITask> {
    return new Observable<ITask>((observable) => {
      const dbRef = ref(this.database, `tasks/${this.auth.getUserUid()}/todo`);
      const epochDate = date ? this.getEpochUtc(date) : undefined;
      push(dbRef, { text, date: epochDate ?? null, order: 0 })
        .then((task) => {
          observable.next({
            text,
            date,
            id: task.key ?? '',
            order: 0,
          });
          observable.complete();
        })
        .catch((error) => {
          this.showError();
          observable.error(error);
        });
    });
  }

  public updateTask(
    done: boolean,
    taskId: string,
    text: string,
    date?: Date
  ): Observable<void> {
    return new Observable<void>((observable) => {
      const tasksRef = ref(
        this.database,
        `${this.getDbTasksPath(done)}/${taskId}`
      );

      const updates: any = {};
      updates['text'] = text;
      updates['date'] = date ? this.getEpochUtc(date) : null;

      update(tasksRef, updates)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          this.showError();
          observable.error(error);
        });
    });
  }

  public getTodo(): Observable<ITask[]> {
    return this.getTasks(false);
  }

  public getDone(): Observable<ITask[]> {
    return this.getTasks(true);
  }

  protected getTasks(done: boolean): Observable<ITask[]> {
    return new Observable<ITask[]>((observable) => {
      const tasksRef = ref(this.database, this.getDbTasksPath(done));
      onValue(
        tasksRef,
        (snapshot) => {
          const data = snapshot.val();
          const tasks = this.getTasksFromDb(data);
          observable.next(tasks);
          observable.complete();
        },
        (error) => {
          this.showError();
          observable.error(error);
        }
      );
    });
  }

  public deleteTask(taskId: string, done: boolean): Observable<void> {
    return new Observable<void>((observable) => {
      const tasksRef = ref(
        this.database,
        `${this.getDbTasksPath(done)}/${taskId}`
      );

      remove(tasksRef)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          this.showError();
          observable.error(error);
        });
    });
  }

  public orderTasks(ids: string[], done: boolean): Observable<void> {
    return new Observable<void>((observable) => {
      const tasksRef = ref(this.database, this.getDbTasksPath(done));

      const updates: any = {};
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        updates[`${id}/order`] = i;
      }

      update(tasksRef, updates)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          this.showError();
          observable.error(error);
        });
    });
  }

  public markTaskAs(task: ITask, done: boolean): Observable<void> {
    return new Observable<void>((observable) => {
      const dbRef = ref(this.database, `tasks/${this.auth.getUserUid()}`);
      const currentContainer = done ? 'todo' : 'done';
      const targetContainer = done ? 'done' : 'todo';

      const updates: any = {};
      updates[`${currentContainer}/${task.id}`] = null;
      updates[`${targetContainer}/${task.id}`] = this.getDbTask(task);

      update(dbRef, updates)
        .then(() => {
          observable.next();
          observable.complete();
        })
        .catch((error) => {
          this.showError();
          observable.error(error);
        });
    });
  }

  private getDbTasksPath(done: boolean): string {
    return `tasks/${this.auth.getUserUid()}/${done ? 'done' : 'todo'}`;
  }

  private getTasksFromDb(data: IDbTask[]): ITask[] {
    let tasks: ITask[] = [];
    for (const key in data) {
      const item = data[key];
      tasks.push({
        id: key,
        text: item.text,
        order: item.order,
        date: item.date ? this.getLocalDate(item.date) : undefined,
      });
    }
    return tasks.sort((a, b) => a.order - b.order);
  }

  private getDbTask(task: ITask): IDbTask {
    return {
      text: task.text,
      order: task.order,
      date: task.date ? this.getEpochUtc(task.date) : null,
    };
  }

  private getEpochUtc(date: Date): number {
    const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utc.getTime();
  }

  private getLocalDate(utcEpoch: number): Date {
    return new Date(utcEpoch - new Date().getTimezoneOffset() * 60000);
  }
}
