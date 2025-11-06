import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTransaction } from './add-new-transaction';

describe('AddNewTransaction', () => {
  let component: AddNewTransaction;
  let fixture: ComponentFixture<AddNewTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
