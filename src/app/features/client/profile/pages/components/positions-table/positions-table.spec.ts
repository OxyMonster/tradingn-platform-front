import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsTable } from './positions-table';

describe('PositionsTable', () => {
  let component: PositionsTable;
  let fixture: ComponentFixture<PositionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
