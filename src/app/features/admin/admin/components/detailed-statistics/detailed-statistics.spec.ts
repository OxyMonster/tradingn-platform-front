import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedStatisticsComponent } from './detailed-statistics';

describe('DetailedStatistics', () => {
  let component: DetailedStatisticsComponent;
  let fixture: ComponentFixture<DetailedStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedStatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
