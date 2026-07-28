import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicChart } from './dynamic-chart';

describe('DynamicChart', () => {
  let component: DynamicChart;
  let fixture: ComponentFixture<DynamicChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
