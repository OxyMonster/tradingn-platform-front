import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingTerminal } from './trading-terminal';

describe('TradingTerminal', () => {
  let component: TradingTerminal;
  let fixture: ComponentFixture<TradingTerminal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingTerminal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingTerminal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
