import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkersComponent } from './admin-workers';

describe('AdminWorkers', () => {
  let component: AdminWorkersComponent;
  let fixture: ComponentFixture<AdminWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
