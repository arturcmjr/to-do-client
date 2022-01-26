import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeStamp'
})
export class TimeStampPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | null {
    const dateTime = DateTime.fromSeconds(value / 1000);
    return dateTime.toLocaleString(DateTime.DATETIME_SHORT);
  }
}
