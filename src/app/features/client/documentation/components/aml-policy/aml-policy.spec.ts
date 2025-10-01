import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlPolicy } from './aml-policy';

describe('AmlPolicy', () => {
  let component: AmlPolicy;
  let fixture: ComponentFixture<AmlPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmlPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmlPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
