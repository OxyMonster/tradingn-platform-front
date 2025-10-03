import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommonDomainsComponent } from './admin-common-domains';

describe('AdminCommonDomains', () => {
  let component: AdminCommonDomainsComponent;
  let fixture: ComponentFixture<AdminCommonDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCommonDomainsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCommonDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
