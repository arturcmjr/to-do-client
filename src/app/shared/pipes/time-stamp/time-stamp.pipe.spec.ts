import { TimeStampPipe } from '../time-stamp/time-stamp.pipe';

describe('TimeStampPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeStampPipe();
    expect(pipe).toBeTruthy();
  });
});
