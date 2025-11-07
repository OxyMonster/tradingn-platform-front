import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkers } from './edit-workers';

describe('EditWorkers', () => {
  let component: EditWorkers;
  let fixture: ComponentFixture<EditWorkers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWorkers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
