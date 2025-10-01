import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgreement } from './user-agreement';

describe('UserAgreement', () => {
  let component: UserAgreement;
  let fixture: ComponentFixture<UserAgreement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAgreement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAgreement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
