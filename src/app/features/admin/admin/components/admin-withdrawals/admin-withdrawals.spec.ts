import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWithdrawalsComponent } from './admin-withdrawals';

describe('AdminWithdrawals', () => {
  let component: AdminWithdrawalsComponent;
  let fixture: ComponentFixture<AdminWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWithdrawalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
