import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketCap } from './market-cap';

describe('MarketCap', () => {
  let component: MarketCap;
  let fixture: ComponentFixture<MarketCap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketCap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketCap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
