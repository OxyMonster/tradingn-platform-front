import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossRates } from './cross-rates';

describe('CrossRates', () => {
  let component: CrossRates;
  let fixture: ComponentFixture<CrossRates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossRates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossRates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
