import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catalogueviewer } from './catalogueviewer';

describe('Catalogueviewer', () => {
  let component: Catalogueviewer;
  let fixture: ComponentFixture<Catalogueviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogueviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catalogueviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
