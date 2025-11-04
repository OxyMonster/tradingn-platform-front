import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsNavigation } from './transactions-navigation';

describe('TransactionsNavigation', () => {
  let component: TransactionsNavigation;
  let fixture: ComponentFixture<TransactionsNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
