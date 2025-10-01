import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOfficialChannels } from './verify-official-channels';

describe('VerifyOfficialChannels', () => {
  let component: VerifyOfficialChannels;
  let fixture: ComponentFixture<VerifyOfficialChannels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOfficialChannels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyOfficialChannels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
