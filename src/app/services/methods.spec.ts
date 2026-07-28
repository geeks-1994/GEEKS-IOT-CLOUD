import { TestBed } from '@angular/core/testing';

import { Methods } from './methods';

describe('Methods', () => {
  let service: Methods;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Methods);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
