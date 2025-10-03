import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymnetsComponent } from './admin-paymnets';

describe('AdminPaymnets', () => {
  let component: AdminPaymnetsComponent;
  let fixture: ComponentFixture<AdminPaymnetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPaymnetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPaymnetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
