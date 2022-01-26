import { Injectable } from '@angular/core';
import { AuthService } from '@shared/auth/auth.service';
import { User } from 'firebase/auth';
import { Database, onValue, ref, set } from 'firebase/database';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { ITask } from './tasks.interface';

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

  public setTasks(tasks: ITask[], done: boolean): void {
    if(!this.user) return;
    // TODO: handle error
    set(ref(this.database, `tasks/${this.user?.uid}/${done? 'done': 'todo'}`), tasks);
  }

  public getTasks(done: boolean) : Observable<ITask[]> {
    return new Observable<ITask[]>((observable) => {
      const tasksRef = ref(this.database, `tasks/${this.user?.uid}/${done? 'done': 'todo'}`);
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        observable.next(data);
        observable.complete();  
      },(err) => {
        console.log(err);
        // TODO: handle error
      });
    });
  }
}
