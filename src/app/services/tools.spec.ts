import { TestBed } from '@angular/core/testing';

import { Tools } from './tools';

describe('Tools', () => {
  let service: Tools;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tools);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
