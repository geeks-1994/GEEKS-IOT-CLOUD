import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fleetviewer } from './fleetviewer';

describe('Fleetviewer', () => {
  let component: Fleetviewer;
  let fixture: ComponentFixture<Fleetviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fleetviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fleetviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
