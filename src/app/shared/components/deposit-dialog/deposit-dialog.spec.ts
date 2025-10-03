import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositDialog } from './deposit-dialog';

describe('DepositDialog', () => {
  let component: DepositDialog;
  let fixture: ComponentFixture<DepositDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
