import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'relativeTimeStamp'
})
export class RelativeTimeStampPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | null {
    const dateTime = DateTime.fromSeconds(value / 1000);
    return dateTime.toRelative();
  }
}
