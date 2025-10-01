import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugBounty } from './bug-bounty';

describe('BugBounty', () => {
  let component: BugBounty;
  let fixture: ComponentFixture<BugBounty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugBounty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugBounty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
