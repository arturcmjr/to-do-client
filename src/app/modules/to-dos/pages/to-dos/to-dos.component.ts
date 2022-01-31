import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DateTime } from 'luxon';
import { FirebaseService } from '@shared/services/firebase/firebase.service';
import { ref, set } from 'firebase/database';
import { AuthService } from '@shared/auth/auth.service';
import { TasksService } from '@shared/services/tasks/tasks.service';
import { ITask } from '@shared/services/tasks/tasks.interface';
import { MatDialog } from '@angular/material/dialog';
import { ToDoDialogComponent } from '@modules/to-dos/components/to-do-dialog/to-do-dialog.component';
import { combineLatest } from 'rxjs';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ 'max-height': 0 }),
    animate('200ms', style({ 'max-height': '100px' })),
  ]),
  transition(':leave', [
    style({ 'max-height': '100px' }),
    animate('200ms', style({ 'max-height': 0 })),
  ]),
]);

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeAnimation],
})
export class ToDosComponent implements OnInit {
  public todo: ITask[] = [];
  public done: ITask[] = [];
  public showDone = false;
  public disableListAnimation = false;
  public isLoading = false;

  constructor(private tasksService: TasksService, private dialog: MatDialog) {}

  public openDialog(task?: ITask): void {
    const dialogRef = this.dialog.open(ToDoDialogComponent, {
      width: '350px',
      data: { ...task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.text) {
        this.tasksService
          .createTodo(result.text, result.date)
          .subscribe((task) => {
            this.todo.unshift(task);
            this.saveOrder(false);
          });
      }
      else if(result?.delete) {
        const uid: string = result.delete;
        const done = !!this.done.find(t => t.id === uid);
        this.tasksService.deleteTask(uid,done).subscribe(() => {
          const tasks = done? this.done : this.todo;
          const found = tasks.find(t => t.id === uid);
          const index = found? tasks.indexOf(found) : -1;
          tasks.splice(index,1);
        });
      }
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  private fetchData(): void {
    const toDo = this.tasksService.getTodo();
    const done = this.tasksService.getDone();

    this.isLoading = true;
    combineLatest([toDo, done]).subscribe(([toDoTasks, doneTasks]) => {
      this.todo = toDoTasks;
      this.done = doneTasks;
      this.isLoading = false;
    });
  }

  private saveOrder(done: boolean): void {
    const ids = done ? this.done.map((x) => x.id) : this.todo.map((x) => x.id);
    this.tasksService.orderTasks(ids, done).subscribe();
  }

  public drop(event: CdkDragDrop<ITask[]>): void {
    console.log(event.container.id);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveOrder(true);
      this.saveOrder(false);
      // this.tasksService.setTasks(this.todoNew, false);
      // this.tasksService.setTasks(this.doneNew, true);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(this.done);
      // this.tasksService.setTasks(this.todoNew, false);
      // this.tasksService.setTasks(this.doneNew, true);
    }
  }

  public ngOnInit(): void {
    this.fetchData();
  }

  public onDragBegin(): void {
    this.disableListAnimation = true;
  }

  public onDragEnd(): void {
    window.setTimeout(() => {
      this.disableListAnimation = false;
    });
  }

  public checkboxClick(item: ITask, done: boolean): void {
    console.log(item);
    this.tasksService.markTaskAs(item, done).subscribe();
    window.setTimeout(() => {
      if (!done) {
        transferArrayItem(this.done, this.todo, this.done.indexOf(item), 0);
      } else {
        transferArrayItem(this.todo, this.done, this.todo.indexOf(item), 0);
      }
    }, 0);
  }

  public getRelativeTime(date: Date): string | null {
    const dateTime = DateTime.fromJSDate(date);
    return dateTime.toRelative();
  }
}
