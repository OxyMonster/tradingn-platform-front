import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkerDomainsComponent } from './admin-worker-domains';

describe('AdminWorkerDomains', () => {
  let component: AdminWorkerDomainsComponent;
  let fixture: ComponentFixture<AdminWorkerDomainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkerDomainsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkerDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
