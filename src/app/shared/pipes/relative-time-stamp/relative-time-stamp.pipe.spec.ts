import { RelativeTimeStampPipe } from '../relative-time-stamp/relative-time-stamp.pipe';

describe('RelativeTimeStampPipe', () => {
  it('create an instance', () => {
    const pipe = new RelativeTimeStampPipe();
    expect(pipe).toBeTruthy();
  });
});
