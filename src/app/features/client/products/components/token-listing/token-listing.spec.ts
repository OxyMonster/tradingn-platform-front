import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenListing } from './token-listing';

describe('TokenListing', () => {
  let component: TokenListing;
  let fixture: ComponentFixture<TokenListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
