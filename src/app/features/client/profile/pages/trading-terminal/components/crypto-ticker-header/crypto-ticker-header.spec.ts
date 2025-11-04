import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoTickerHeader } from './crypto-ticker-header';

describe('CryptoTickerHeader', () => {
  let component: CryptoTickerHeader;
  let fixture: ComponentFixture<CryptoTickerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoTickerHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoTickerHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
