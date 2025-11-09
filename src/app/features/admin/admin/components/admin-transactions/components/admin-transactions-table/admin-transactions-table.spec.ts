import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTransactionsTable } from './admin-transactions-table';

describe('AdminTransactionsTable', () => {
  let component: AdminTransactionsTable;
  let fixture: ComponentFixture<AdminTransactionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTransactionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTransactionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
