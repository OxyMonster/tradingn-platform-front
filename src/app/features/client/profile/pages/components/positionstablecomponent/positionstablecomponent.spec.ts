import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Positionstablecomponent } from './positionstablecomponent';

describe('Positionstablecomponent', () => {
  let component: Positionstablecomponent;
  let fixture: ComponentFixture<Positionstablecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Positionstablecomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Positionstablecomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
