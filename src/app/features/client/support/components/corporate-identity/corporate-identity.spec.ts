import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateIdentity } from './corporate-identity';

describe('CorporateIdentity', () => {
  let component: CorporateIdentity;
  let fixture: ComponentFixture<CorporateIdentity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporateIdentity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorporateIdentity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
