import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPromoCodesComponent } from './admin-promo-codes';

describe('AdminPromoCodes', () => {
  let component: AdminPromoCodesComponent;
  let fixture: ComponentFixture<AdminPromoCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPromoCodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPromoCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
