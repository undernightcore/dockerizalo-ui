import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildsComponent } from './builds.component';

describe('BuildsComponent', () => {
  let component: BuildsComponent;
  let fixture: ComponentFixture<BuildsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
