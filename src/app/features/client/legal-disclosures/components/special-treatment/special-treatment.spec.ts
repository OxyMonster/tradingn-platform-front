import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialTreatment } from './special-treatment';

describe('SpecialTreatment', () => {
  let component: SpecialTreatment;
  let fixture: ComponentFixture<SpecialTreatment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialTreatment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialTreatment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
