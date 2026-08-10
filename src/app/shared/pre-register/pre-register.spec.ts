import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegister } from './pre-register';

describe('PreRegister', () => {
  let component: PreRegister;
  let fixture: ComponentFixture<PreRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
