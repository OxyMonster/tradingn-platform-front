import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSupports } from './admin-supports';

describe('AdminSupports', () => {
  let component: AdminSupports;
  let fixture: ComponentFixture<AdminSupports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSupports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSupports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
