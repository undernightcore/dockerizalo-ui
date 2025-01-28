import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortsComponent } from './ports.component';

describe('PortsComponent', () => {
  let component: PortsComponent;
  let fixture: ComponentFixture<PortsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
