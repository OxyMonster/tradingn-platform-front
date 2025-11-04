import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatDeposit } from './fiat-deposit';

describe('FiatDeposit', () => {
  let component: FiatDeposit;
  let fixture: ComponentFixture<FiatDeposit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiatDeposit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiatDeposit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
