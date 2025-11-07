import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWorkers } from './register-workers';

describe('RegisterWorkers', () => {
  let component: RegisterWorkers;
  let fixture: ComponentFixture<RegisterWorkers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWorkers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWorkers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
