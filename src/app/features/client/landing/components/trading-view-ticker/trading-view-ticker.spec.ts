import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingViewTicker } from './trading-view-ticker';

describe('TradingViewTicker', () => {
  let component: TradingViewTicker;
  let fixture: ComponentFixture<TradingViewTicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingViewTicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingViewTicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
