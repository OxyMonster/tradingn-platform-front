import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsdtPerpetuals } from './usdt-perpetuals';

describe('UsdtPerpetuals', () => {
  let component: UsdtPerpetuals;
  let fixture: ComponentFixture<UsdtPerpetuals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsdtPerpetuals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsdtPerpetuals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
