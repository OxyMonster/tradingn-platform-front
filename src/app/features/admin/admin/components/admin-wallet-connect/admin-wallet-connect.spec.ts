import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWalletConnectComponent } from './admin-wallet-connect';

describe('AdminWalletConnect', () => {
  let component: AdminWalletConnectComponent;
  let fixture: ComponentFixture<AdminWalletConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWalletConnectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWalletConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
