import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransferCryptoDialog } from './client-transfer-crypto-dialog';

describe('ClientTransferCryptoDialog', () => {
  let component: ClientTransferCryptoDialog;
  let fixture: ComponentFixture<ClientTransferCryptoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransferCryptoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTransferCryptoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
