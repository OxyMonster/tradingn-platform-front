import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSupportComponent } from './admin-support';

describe('AdminSupport', () => {
  let component: AdminSupportComponent;
  let fixture: ComponentFixture<AdminSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSupportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
