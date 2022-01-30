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
  public todoNew: ITask[] = [];
  public doneNew: ITask[] = [];
  public showDone = false;
  public disableListAnimation = false;

  constructor(private tasksService: TasksService, private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ToDoDialogComponent, {
      width: '350px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.text) {
        this.tasksService.createTodo(result.text).subscribe((task) => {
          this.todoNew.push(task);
          // TODO: DRY
          const ids = this.todoNew.map((x) => x.id);
          this.tasksService.orderTodo(ids).subscribe();
        });
      }
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  public drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const ids = this.todoNew.map((x) => x.id);
      this.tasksService.orderTodo(ids).subscribe(() => console.log('done'));
      // this.tasksService.setTasks(this.todoNew, false);
      // this.tasksService.setTasks(this.doneNew, true);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(this.doneNew);
      // this.tasksService.setTasks(this.todoNew, false);
      // this.tasksService.setTasks(this.doneNew, true);
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    window.setTimeout(() => {
      // const data = { text: 'Bom dia', deadline: Date.now() };
      // console.log(data);
      // this.tasksService.setTasks([data], true);
      // this.tasksService.setTasks(
      //   [{ text: 'Caminhar com as cachorras' }, { text: 'Soltar um pum' }],
      //   false
      // );
      // this.tasksService.addTodo('Bom dia Maya!').subscribe((task) => {
      //   this.todoNew.push(task);
      //   console.log(task);
      // });
      // this.tasksService.getTasks(true).subscribe(tasks => {
      //   // this.doneNew = tasks || [];
      //   console.log(tasks);
      // });
      this.tasksService.getTodo().subscribe((toDos) => {
        console.log(toDos);
        this.todoNew = toDos;
        // this.todoNew = tasks || [];
        // console.log(Object.values(tasks));
        // console.log(tasks);
        // for (let task in tasks) {
        //   console.log(task,tasks[task]);
        // }
      });
    }, 1000);
  }

  public onDragBegin() : void {
    this.disableListAnimation = true;
  }

  public onDragEnd() : void {
    window.setTimeout(() => {
      this.disableListAnimation = false;
    });
  }

  public checkboxClick(item: ITask, todo: boolean): void {
    console.log(item);
    window.setTimeout(() => {
      if (todo) {
        transferArrayItem(
          this.doneNew,
          this.todoNew,
          this.doneNew.indexOf(item),
          0
        );
      } else {
        transferArrayItem(
          this.todoNew,
          this.doneNew,
          this.todoNew.indexOf(item),
          0
        );
      }
    }, 0);
  }

  public getRelativeTime(date: Date): string | null {
    const dateTime = DateTime.fromJSDate(date);
    return dateTime.toRelative();
  }
}
