import { TestBed } from '@angular/core/testing';

import { PortsService } from './ports.service';

describe('PortsService', () => {
  let service: PortsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
