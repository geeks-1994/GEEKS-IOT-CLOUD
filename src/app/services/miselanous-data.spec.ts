import { TestBed } from '@angular/core/testing';

import { MiselanousData } from './miselanous-data';

describe('MiselanousData', () => {
  let service: MiselanousData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiselanousData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
