import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawEnforcementRequests } from './law-enforcement-requests';

describe('LawEnforcementRequests', () => {
  let component: LawEnforcementRequests;
  let fixture: ComponentFixture<LawEnforcementRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawEnforcementRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawEnforcementRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
