import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Margin } from './margin';

describe('Margin', () => {
  let component: Margin;
  let fixture: ComponentFixture<Margin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Margin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Margin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
