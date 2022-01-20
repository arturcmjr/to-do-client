import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DateTime } from 'luxon';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ 'max-height': 0 }),
    animate('200ms', style({ 'max-height': '100px' })),
  ]),
  transition(':leave', [
    style({ 'max-height': '100px'}),
    animate('200ms', style({ 'max-height': 0 })),
  ]),
]);

export interface IToDos {
  order: number;
  text: string;
  deadline?: Date;
  done: boolean;
}

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeAnimation],
})
export class ToDosComponent implements OnInit {
  public todoNew: IToDos[] = [
    {order: 0, text: 'apertar o cachorro', done: false, deadline: new Date('2022-01-20T15:00:00')},
    {order: 1, text: 'almoçar', done: false},
    {order: 2, text: 'jogar videogame', done: false, deadline: new Date('2022-01-20T20:30:00')},
  ];
  public doneNew: IToDos[] = [
    {order: 3, text: 'crise de ansiedade', done: true},
    {order: 4, text: 'fisioterapia', done: true},
  ];
  public showDone = false;

  constructor() {}

  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<IToDos[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  public checkboxClick(item: IToDos, todo: boolean): void {
    console.log(item);
    window.setTimeout(() => {
      if (todo) {
        transferArrayItem(this.doneNew, this.todoNew, this.doneNew.indexOf(item), 0);
      } else {
        transferArrayItem(this.todoNew, this.doneNew, this.todoNew.indexOf(item), 0);
      }
    }, 0);
  }

  public getRelativeTime(date: Date) : string | null {
    const dateTime = DateTime.fromJSDate(date);
    return dateTime.toRelative();
  }
}
