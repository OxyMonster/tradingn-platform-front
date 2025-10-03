import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingViewWidget } from './trading-view-widget';

describe('TradingViewWidget', () => {
  let component: TradingViewWidget;
  let fixture: ComponentFixture<TradingViewWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingViewWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingViewWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
