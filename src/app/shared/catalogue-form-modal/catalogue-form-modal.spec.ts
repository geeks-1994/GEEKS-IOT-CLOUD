import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueFormModal } from './catalogue-form-modal';

describe('CatalogueFormModal', () => {
  let component: CatalogueFormModal;
  let fixture: ComponentFixture<CatalogueFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
