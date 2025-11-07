import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWorkerPassword } from './change-worker-password';

describe('ChangeWorkerPassword', () => {
  let component: ChangeWorkerPassword;
  let fixture: ComponentFixture<ChangeWorkerPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeWorkerPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeWorkerPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
