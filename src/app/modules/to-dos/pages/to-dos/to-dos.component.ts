import {
  Component,
  IterableDiffers,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { animate, style, transition, trigger } from '@angular/animations';
import { DateTime } from 'luxon';
import { TasksService } from '@shared/services/tasks/tasks.service';
import { ITask } from '@shared/services/tasks/tasks.interface';
import { MatDialog } from '@angular/material/dialog';
import {
  ITasksDialogResult,
  ToDoDialogComponent,
} from '@modules/to-dos/components/to-do-dialog/to-do-dialog.component';
import { combineLatest } from 'rxjs';
import { Title } from '@angular/platform-browser';

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
  private differ: any;

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog,
    private titleService: Title,
    private differs: IterableDiffers
  ) {
    this.differ = differs.find(this.todo).create();
  }

  public ngOnInit(): void {
    this.fetchData();
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this.todo);
    if (change) this.updateTitle();
  }

  public openDialog(task?: ITask): void {
    const dialogRef = this.dialog.open(ToDoDialogComponent, {
      width: '350px',
      data: { ...task },
    });
    dialogRef.afterClosed().subscribe((data) => this.onDialogClose(data));
  }

  private onDialogClose(data: ITasksDialogResult | null): void {
    if (data) {
      switch (data.category) {
        case 'create':
          this.onTaskCreate(data);
          break;
        case 'update':
          this.onTaskUpdate(data);
          break;
        case 'delete':
          this.onTaskDelete(data);
          break;
      }
    }
  }

  private onTaskCreate(data: ITasksDialogResult): void {
    if (!data.text) return;
    this.tasksService.createTodo(data.text, data.date).subscribe((task) => {
      this.todo.unshift(task);
      this.saveOrder(false);
    });
  }

  private onTaskUpdate(data: ITasksDialogResult): void {
    const done = this.taskIsDone(data.taskId);
    if (!data.text) return;
    this.tasksService
      .updateTask(done, data.taskId, data.text, data.date)
      .subscribe(() => {
        const tasks = done ? this.done : this.todo;
        const found = tasks.find((t) => t.id === data.taskId);
        if (found && data.text) {
          found.text = data.text;
          found.date = data.date;
        }
      });
  }

  private onTaskDelete(data: ITasksDialogResult): void {
    const done = this.taskIsDone(data.taskId);
    this.tasksService.deleteTask(data.taskId, done).subscribe(() => {
      const tasks = done ? this.done : this.todo;
      const found = tasks.find((t) => t.id === data.taskId);
      if (found) {
        const index = tasks.indexOf(found);
        tasks.splice(index, 1);
        this.saveOrder(done);
      }
    });
  }

  private taskIsDone(taskId: string): boolean {
    return !!this.done.find((t) => t.id === taskId);
  }

  private updateTitle(): void {
    this.titleService.setTitle(`To Do (${this.todo.length})`);
  }

  private fetchData(): void {
    const toDo = this.tasksService.getTodo();
    const done = this.tasksService.getDone();

    this.isLoading = true;
    combineLatest([toDo, done]).subscribe(([toDoTasks, doneTasks]) => {
      this.todo = toDoTasks;
      this.done = doneTasks;
      this.isLoading = false;
      this.updateTitle();
    });
  }

  private saveOrder(done: boolean): void {
    const ids = done ? this.done.map((x) => x.id) : this.todo.map((x) => x.id);
    this.tasksService.orderTasks(ids, done).subscribe();
  }

  public drop(event: CdkDragDrop<ITask[]>): void {
    const taskWasDone = event.previousContainer.id === 'doneList';
    const tasks = taskWasDone ? this.done : this.todo;
    const item = tasks[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.saveOrder(taskWasDone);
    } else {
      this.markTaskAs(item, !taskWasDone, event.currentIndex);
    }
  }

  public onDragBegin(): void {
    this.disableListAnimation = true;
  }

  public onDragEnd(): void {
    window.setTimeout(() => {
      this.disableListAnimation = false;
    });
  }

  public markTaskAs(item: ITask, done: boolean, order: number = 0): void {
    this.tasksService.markTaskAs(item, done).subscribe();
    window.setTimeout(() => {
      if (!done) {
        transferArrayItem(this.done, this.todo, this.done.indexOf(item), order);
      } else {
        transferArrayItem(this.todo, this.done, this.todo.indexOf(item), order);
      }
      this.saveOrder(true);
      this.saveOrder(false);
    }, 0);
  }

  public getRelativeTime(date: Date): string | null {
    const dateTime = DateTime.fromJSDate(date);
    return dateTime.toRelative();
  }
}
