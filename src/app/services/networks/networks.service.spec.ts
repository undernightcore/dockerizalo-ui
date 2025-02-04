import { TestBed } from '@angular/core/testing';

import { NetworksService } from './networks.service';

describe('NetworksService', () => {
  let service: NetworksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
