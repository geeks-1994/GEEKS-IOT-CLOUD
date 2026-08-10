import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicChartModal } from './dynamic-chart-modal';

describe('DynamicChartModal', () => {
  let component: DynamicChartModal;
  let fixture: ComponentFixture<DynamicChartModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicChartModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicChartModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
