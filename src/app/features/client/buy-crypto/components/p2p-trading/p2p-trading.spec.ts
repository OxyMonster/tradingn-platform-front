import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pTrading } from './p2p-trading';

describe('P2pTrading', () => {
  let component: P2pTrading;
  let fixture: ComponentFixture<P2pTrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2pTrading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2pTrading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
