import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketScreener } from './market-screener';

describe('MarketScreener', () => {
  let component: MarketScreener;
  let fixture: ComponentFixture<MarketScreener>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketScreener]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketScreener);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
