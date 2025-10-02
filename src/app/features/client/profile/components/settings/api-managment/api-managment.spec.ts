import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiManagment } from './api-managment';

describe('ApiManagment', () => {
  let component: ApiManagment;
  let fixture: ComponentFixture<ApiManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
