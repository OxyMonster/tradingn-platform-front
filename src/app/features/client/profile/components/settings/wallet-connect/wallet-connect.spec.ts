import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletConnect } from './wallet-connect';

describe('WalletConnect', () => {
  let component: WalletConnect;
  let fixture: ComponentFixture<WalletConnect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletConnect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletConnect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
