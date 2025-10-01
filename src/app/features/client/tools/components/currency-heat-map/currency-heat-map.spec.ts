import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyHeatMap } from './currency-heat-map';

describe('CurrencyHeatMap', () => {
  let component: CurrencyHeatMap;
  let fixture: ComponentFixture<CurrencyHeatMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyHeatMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyHeatMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
