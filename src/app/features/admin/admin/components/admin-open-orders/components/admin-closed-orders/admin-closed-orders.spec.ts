import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClosedOrders } from './admin-closed-orders';

describe('AdminClosedOrders', () => {
  let component: AdminClosedOrders;
  let fixture: ComponentFixture<AdminClosedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClosedOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClosedOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
