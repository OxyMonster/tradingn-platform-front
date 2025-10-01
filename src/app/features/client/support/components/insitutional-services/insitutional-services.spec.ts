import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsitutionalServices } from './insitutional-services';

describe('InsitutionalServices', () => {
  let component: InsitutionalServices;
  let fixture: ComponentFixture<InsitutionalServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsitutionalServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsitutionalServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
