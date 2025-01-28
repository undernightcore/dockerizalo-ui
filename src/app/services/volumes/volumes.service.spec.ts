import { TestBed } from '@angular/core/testing';

import { VolumesService } from './volumes.service';

describe('VolumesService', () => {
  let service: VolumesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
