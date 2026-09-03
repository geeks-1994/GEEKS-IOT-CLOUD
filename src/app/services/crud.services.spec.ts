import { TestBed } from '@angular/core/testing';

import { CRUDServices } from './crud.services';

describe('CRUDServices', () => {
  let service: CRUDServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CRUDServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
