import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryLicense } from './regulatory-license';

describe('RegulatoryLicense', () => {
  let component: RegulatoryLicense;
  let fixture: ComponentFixture<RegulatoryLicense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulatoryLicense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegulatoryLicense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
