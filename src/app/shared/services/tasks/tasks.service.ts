import { Injectable } from '@angular/core';
import { AuthService } from '@shared/auth/auth.service';
import { User } from 'firebase/auth';
import {
  child,
  Database,
  onValue,
  push,
  ref,
  set,
  update,
} from 'firebase/database';
import { observable, Observable, EMPTY } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { IDbTask, ITask } from './tasks.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private database: Database;
  private user: User | null = null;

  constructor(private firebase: FirebaseService, private auth: AuthService) {
    this.database = firebase.getDataBase();
    const fbAuth = auth.getFirebaseAuth();
    fbAuth.onAuthStateChanged((user) => (this.user = user));
  }

  public createTodo(text: string, date?: Date): Observable<ITask> {
    return new Observable<ITask>((observable) => {
      const dbRef = ref(this.database, `tasks/${this.user?.uid}/todo`);
      const epochDate = date?.getTime();
      push(dbRef, { text, date: epochDate ?? null, order: 0 }).then((task) => {
        observable.next({
          text,
          date: epochDate,
          id: task.key ?? '',
          order: 0,
        });
        observable.complete();
      });
      // TODO: handle error
    });
  }

  // public setTasks(tasks: ITask[], done: boolean): void {
  //   if (!this.user) return;
  //   // TODO: handle error
  //   set(
  //     ref(this.database, `tasks/${this.user?.uid}/${done ? 'done' : 'todo'}`),
  //     tasks
  //   );
  // }

  public getTodo(): Observable<ITask[]> {
    return this.getTasks(false);
  }

  public getDone(): Observable<ITask[]> {
    return this.getTasks(true);
  }

  public orderTodo(ids: string[]): Observable<void> {
    return this.orderTasks(ids, false);
  }

  public orderDone(ids: string[]): Observable<void> {
    return this.orderTasks(ids, true);
  }

  private orderTasks(ids: string[], done: boolean): Observable<void> {
    return new Observable<void>((observable) => {
      const tasksRef = ref(this.database, this.getDbTasksPath(done));

      const updates: any = {};
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        updates[`${id}/order`] = i;
      }

      update(tasksRef, updates).then(() => {
        observable.next();
        observable.complete();
      });
      // TODO: handle error
    });
  }

  private getTasks(done: boolean): Observable<ITask[]> {
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
        (err) => {
          console.log(err);
          // TODO: handle error
        }
      );
    });
  }

  private getDbTasksPath(done: boolean): string {
    return `tasks/${this.user?.uid}/${done ? 'done' : 'todo'}`;
  }

  private getTasksFromDb(data: IDbTask[]): ITask[] {
    let tasks: ITask[] = [];
    for (const key in data) {
      const item = data[key];
      tasks.push({
        id: key,
        text: item.text,
        order: item.order,
        date: item.date,
      });
    }
    return tasks.sort((a, b) => a.order - b.order);
  }
}
