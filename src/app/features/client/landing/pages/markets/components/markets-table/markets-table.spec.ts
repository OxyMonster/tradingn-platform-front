import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsTable } from './markets-table';

describe('MarketsTable', () => {
  let component: MarketsTable;
  let fixture: ComponentFixture<MarketsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
