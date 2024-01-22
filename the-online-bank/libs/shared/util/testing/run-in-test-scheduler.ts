import { RunHelpers, TestScheduler } from 'rxjs/testing';

export const runInTestScheduler = <T>(callback: (helpers: RunHelpers) => T) =>
  new TestScheduler((actual, expected) => expect(actual).toEqual(expected)).run(callback);
