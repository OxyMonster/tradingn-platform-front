import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoLanding } from './crypto-landing';

describe('CryptoLanding', () => {
  let component: CryptoLanding;
  let fixture: ComponentFixture<CryptoLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
