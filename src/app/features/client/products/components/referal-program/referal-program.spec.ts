import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalProgram } from './referal-program';

describe('ReferalProgram', () => {
  let component: ReferalProgram;
  let fixture: ComponentFixture<ReferalProgram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferalProgram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferalProgram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
