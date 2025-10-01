import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCardOverview } from './our-card-overview';

describe('OurCardOverview', () => {
  let component: OurCardOverview;
  let fixture: ComponentFixture<OurCardOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurCardOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurCardOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
