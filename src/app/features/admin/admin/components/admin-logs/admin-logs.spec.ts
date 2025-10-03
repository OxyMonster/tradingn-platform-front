import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogsComponent } from './admin-logs';

describe('AdminLogs', () => {
  let component: AdminLogsComponent;
  let fixture: ComponentFixture<AdminLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
