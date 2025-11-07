import { TestBed } from '@angular/core/testing';

import { AdminWorkers } from './admin-workers.service';

describe('AdminWorkers', () => {
  let service: AdminWorkers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminWorkers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
