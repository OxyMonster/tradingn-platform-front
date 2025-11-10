import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionsTable } from './client-transactions-table';

describe('ClientTransactionsTable', () => {
  let component: ClientTransactionsTable;
  let fixture: ComponentFixture<ClientTransactionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransactionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTransactionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
