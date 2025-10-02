import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityVerification } from './identity-verification';

describe('IdentityVerification', () => {
  let component: IdentityVerification;
  let fixture: ComponentFixture<IdentityVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentityVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
