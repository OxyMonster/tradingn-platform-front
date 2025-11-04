import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferalProgramComponent } from './refferal-program';

describe('RefferalProgram', () => {
  let component: RefferalProgramComponent;
  let fixture: ComponentFixture<RefferalProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefferalProgramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefferalProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
