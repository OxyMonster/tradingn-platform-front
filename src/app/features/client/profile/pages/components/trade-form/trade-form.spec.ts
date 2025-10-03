import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeForm } from './trade-form';

describe('TradeForm', () => {
  let component: TradeForm;
  let fixture: ComponentFixture<TradeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
