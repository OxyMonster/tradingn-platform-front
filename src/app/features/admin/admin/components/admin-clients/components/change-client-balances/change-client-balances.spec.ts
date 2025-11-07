import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeClientBalances } from './change-client-balances';

describe('ChangeClientBalances', () => {
  let component: ChangeClientBalances;
  let fixture: ComponentFixture<ChangeClientBalances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeClientBalances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeClientBalances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
