import { TimeStampPipe } from './date-format.pipe';

describe('TimeStampPipe', () => {
  const pipe = new TimeStampPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date', () => {
    expect(pipe.transform(1641006000000)).toBe('Jan 1, 2022');
  });
});
